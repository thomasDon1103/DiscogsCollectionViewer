"""
Discogs OAuth 1.0a backend proxy.

This Flask app handles the parts of the Discogs OAuth flow that require the
consumer secret, so it never has to be shipped to the browser. It also signs
authenticated Discogs API requests on behalf of the frontend.

Endpoints
---------
GET  /api/auth/login
    Starts the OAuth flow. Fetches a request token from Discogs, stashes it
    in the session, and returns the URL the frontend should redirect the
    user to (https://www.discogs.com/oauth/authorize?...).

GET  /api/auth/callback?oauth_token=...&oauth_verifier=...
    Discogs redirects the user here after they approve. Exchanges the
    verifier for a long-lived access token, stores it in the session, and
    then redirects the browser back to the frontend.

GET  /api/auth/identity
    Returns the currently signed-in Discogs user's identity, or 401 if not
    signed in.

GET  /api/auth/status
    Lightweight check the frontend can use to see if the session is
    authenticated. Always 200; returns { authenticated, username }.

POST /api/auth/logout
    Clears the user's session.

ANY  /api/discogs/<path:subpath>
    Authenticated proxy to https://api.discogs.com/<subpath>. If the user
    has an access token in their session, requests are signed with it.
    Otherwise the request is forwarded unauthenticated (which still works
    for public Discogs endpoints like public collections).
"""

from __future__ import annotations

import os
import secrets
import time
from urllib.parse import quote, urlencode, parse_qsl

import requests
from flask import (
    Flask,
    jsonify,
    redirect,
    request,
    session,
)
from flask_cors import CORS


# ---------------------------------------------------------------------------
# Configuration
#
# Replace the placeholder credentials below with your real Discogs application
# credentials. In production these should come from environment variables /
# a secret manager rather than being hard-coded.
# ---------------------------------------------------------------------------

DISCOGS_CONSUMER_KEY = os.environ.get(
    "DISCOGS_CONSUMER_KEY", "YOUR_DISCOGS_CONSUMER_KEY"
)
DISCOGS_CONSUMER_SECRET = os.environ.get(
    "DISCOGS_CONSUMER_SECRET", "YOUR_DISCOGS_CONSUMER_SECRET"
)

# Where the frontend lives. Used for CORS and for redirecting the user back
# after the OAuth dance completes.
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

# Public URL of *this* backend. Discogs will send the user here after they
# authorize the application, so it must match (or be allowed by) the callback
# URL configured for your Discogs app.
BACKEND_BASE_URL = os.environ.get(
    "BACKEND_BASE_URL", "http://localhost:5000"
)
OAUTH_CALLBACK_URL = f"{BACKEND_BASE_URL}/api/auth/callback"

# Flask session secret. MUST be overridden in production.
FLASK_SECRET_KEY = os.environ.get(
    "FLASK_SECRET_KEY", "CHANGE_ME_TO_A_RANDOM_SECRET"
)

USER_AGENT = "DiscogsCollectionApp/1.0 +https://example.com"

DISCOGS_API_BASE = "https://api.discogs.com"
DISCOGS_REQUEST_TOKEN_URL = f"{DISCOGS_API_BASE}/oauth/request_token"
DISCOGS_ACCESS_TOKEN_URL = f"{DISCOGS_API_BASE}/oauth/access_token"
DISCOGS_IDENTITY_URL = f"{DISCOGS_API_BASE}/oauth/identity"
DISCOGS_AUTHORIZE_URL = "https://www.discogs.com/oauth/authorize"


# ---------------------------------------------------------------------------
# Flask app setup
# ---------------------------------------------------------------------------

app = Flask(__name__)
app.secret_key = FLASK_SECRET_KEY

# Allow the Vue dev server (and any other configured origin) to call us with
# credentials so the session cookie is sent on cross-origin requests.
CORS(
    app,
    resources={r"/api/*": {"origins": [FRONTEND_ORIGIN]}},
    supports_credentials=True,
)


# ---------------------------------------------------------------------------
# OAuth 1.0a helpers
#
# We use the PLAINTEXT signature method, which Discogs supports. The signature
# is simply `consumer_secret&token_secret` (URL-encoded). This avoids needing
# to compute HMAC-SHA1 signatures.
# ---------------------------------------------------------------------------


def _oauth_nonce() -> str:
    return secrets.token_hex(16)


def _oauth_timestamp() -> str:
    return str(int(time.time()))


def _build_oauth_header(params: dict) -> str:
    parts = [
        f'{quote(k, safe="")}="{quote(v, safe="")}"'
        for k, v in sorted(params.items())
    ]
    return "OAuth " + ", ".join(parts)


def _oauth_auth_header(token_secret: str = "", extra: dict | None = None) -> str:
    """Build an Authorization header for a PLAINTEXT-signed OAuth1 request."""
    signature = f"{quote(DISCOGS_CONSUMER_SECRET, safe='')}&{quote(token_secret, safe='')}"

    params = {
        "oauth_consumer_key": DISCOGS_CONSUMER_KEY,
        "oauth_nonce": _oauth_nonce(),
        "oauth_signature_method": "PLAINTEXT",
        "oauth_timestamp": _oauth_timestamp(),
        "oauth_version": "1.0",
        "oauth_signature": signature,
    }
    if extra:
        params.update(extra)
    return _build_oauth_header(params)


def _parse_oauth_response(body: str) -> dict:
    return dict(parse_qsl(body, keep_blank_values=True))


# ---------------------------------------------------------------------------
# Auth endpoints
# ---------------------------------------------------------------------------


@app.route("/api/auth/login", methods=["GET"])
def auth_login():
    """Step 1 + 2: Get a request token from Discogs and tell the frontend
    where to send the user to authorize the app."""
    try:
        res = requests.get(
            DISCOGS_REQUEST_TOKEN_URL,
            headers={
                "Authorization": _oauth_auth_header(
                    "", {"oauth_callback": OAUTH_CALLBACK_URL}
                ),
                "User-Agent": USER_AGENT,
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        return jsonify({"error": f"Network error contacting Discogs: {exc}"}), 502

    if not res.ok:
        return (
            jsonify(
                {
                    "error": "Failed to obtain OAuth request token",
                    "status": res.status_code,
                    "detail": res.text,
                }
            ),
            502,
        )

    parsed = _parse_oauth_response(res.text)
    request_token = parsed.get("oauth_token")
    request_token_secret = parsed.get("oauth_token_secret")

    if not request_token or not request_token_secret:
        return (
            jsonify({"error": "Discogs did not return an oauth_token / secret"}),
            502,
        )

    # Persist the request token (and especially its secret) in the user's
    # session so we can use it when the user comes back from Discogs.
    session["request_token"] = request_token
    session["request_token_secret"] = request_token_secret

    authorize_url = f"{DISCOGS_AUTHORIZE_URL}?oauth_token={quote(request_token)}"
    return jsonify({"authorize_url": authorize_url})


@app.route("/api/auth/callback", methods=["GET"])
def auth_callback():
    """Step 3: Discogs sent the user back. Exchange the verifier for a
    long-lived access token, store it in the session, and bounce the user
    back to the frontend."""
    oauth_token = request.args.get("oauth_token")
    oauth_verifier = request.args.get("oauth_verifier")

    if not oauth_token or not oauth_verifier:
        return _redirect_with_error("missing_oauth_params")

    request_token = session.get("request_token")
    request_token_secret = session.get("request_token_secret")

    if (
        not request_token
        or not request_token_secret
        or request_token != oauth_token
    ):
        return _redirect_with_error("request_token_mismatch")

    try:
        res = requests.post(
            DISCOGS_ACCESS_TOKEN_URL,
            headers={
                "Authorization": _oauth_auth_header(
                    request_token_secret,
                    {
                        "oauth_token": oauth_token,
                        "oauth_verifier": oauth_verifier,
                    },
                ),
                "User-Agent": USER_AGENT,
            },
            timeout=15,
        )
    except requests.RequestException:
        return _redirect_with_error("network_error")

    if not res.ok:
        return _redirect_with_error(f"access_token_http_{res.status_code}")

    parsed = _parse_oauth_response(res.text)
    access_token = parsed.get("oauth_token")
    access_token_secret = parsed.get("oauth_token_secret")

    if not access_token or not access_token_secret:
        return _redirect_with_error("missing_access_token")

    # Replace the temporary request token with the long-lived access token.
    session.pop("request_token", None)
    session.pop("request_token_secret", None)
    session["access_token"] = access_token
    session["access_token_secret"] = access_token_secret

    # Look up the username so the frontend can show "Signed in as ..."
    # immediately, without needing a follow-up request.
    username = _fetch_identity_username(access_token, access_token_secret)
    if username:
        session["username"] = username

    # Bounce the browser back to the frontend with a success flag.
    return redirect(f"{FRONTEND_ORIGIN}/?discogs_auth=success", code=302)


@app.route("/api/auth/identity", methods=["GET"])
def auth_identity():
    """Return the currently authenticated Discogs user's identity."""
    access_token = session.get("access_token")
    access_token_secret = session.get("access_token_secret")
    if not access_token or not access_token_secret:
        return jsonify({"error": "Not authenticated"}), 401

    try:
        res = requests.get(
            DISCOGS_IDENTITY_URL,
            headers={
                "Authorization": _oauth_auth_header(
                    access_token_secret, {"oauth_token": access_token}
                ),
                "User-Agent": USER_AGENT,
            },
            timeout=15,
        )
    except requests.RequestException as exc:
        return jsonify({"error": f"Network error: {exc}"}), 502

    if not res.ok:
        return (
            jsonify({"error": "Failed to fetch identity", "detail": res.text}),
            res.status_code,
        )

    data = res.json()
    # Cache the username so /api/auth/status is cheap.
    if isinstance(data, dict) and data.get("username"):
        session["username"] = data["username"]
    return jsonify(data)


@app.route("/api/auth/status", methods=["GET"])
def auth_status():
    """Cheap check used by the frontend on page load."""
    authenticated = bool(
        session.get("access_token") and session.get("access_token_secret")
    )
    return jsonify(
        {
            "authenticated": authenticated,
            "username": session.get("username") if authenticated else None,
        }
    )


@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    session.clear()
    return jsonify({"ok": True})


# ---------------------------------------------------------------------------
# Authenticated Discogs API proxy
#
# Any request to /api/discogs/<path> is forwarded to
# https://api.discogs.com/<path>. If the user is signed in, the request is
# signed with their access token. Otherwise it goes out unauthenticated, which
# is still fine for public endpoints (e.g. public collections).
# ---------------------------------------------------------------------------


@app.route(
    "/api/discogs/<path:subpath>",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
)
def discogs_proxy(subpath: str):
    target_url = f"{DISCOGS_API_BASE}/{subpath}"

    headers = {"User-Agent": USER_AGENT}
    access_token = session.get("access_token")
    access_token_secret = session.get("access_token_secret")
    if access_token and access_token_secret:
        headers["Authorization"] = _oauth_auth_header(
            access_token_secret, {"oauth_token": access_token}
        )

    # Forward Content-Type for non-GET requests with bodies.
    if request.method != "GET" and request.content_type:
        headers["Content-Type"] = request.content_type

    try:
        upstream = requests.request(
            method=request.method,
            url=target_url,
            params=request.args,
            data=request.get_data() if request.method != "GET" else None,
            headers=headers,
            timeout=30,
        )
    except requests.RequestException as exc:
        return jsonify({"error": f"Network error: {exc}"}), 502

    # Forward Discogs' content type back to the caller.
    response_headers = {}
    if "Content-Type" in upstream.headers:
        response_headers["Content-Type"] = upstream.headers["Content-Type"]
    return (upstream.content, upstream.status_code, response_headers)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _fetch_identity_username(access_token: str, access_token_secret: str) -> str | None:
    """Best-effort fetch of the authenticated user's username."""
    try:
        res = requests.get(
            DISCOGS_IDENTITY_URL,
            headers={
                "Authorization": _oauth_auth_header(
                    access_token_secret, {"oauth_token": access_token}
                ),
                "User-Agent": USER_AGENT,
            },
            timeout=15,
        )
        if res.ok:
            return res.json().get("username")
    except requests.RequestException:
        pass
    return None


def _redirect_with_error(code: str):
    """Bounce back to the frontend with an error code in the query string."""
    qs = urlencode({"discogs_auth": "error", "reason": code})
    return redirect(f"{FRONTEND_ORIGIN}/?{qs}", code=302)


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------


if __name__ == "__main__":
    # debug=True for local dev only; never enable in production.
    app.run(host="127.0.0.1", port=5000, debug=True)