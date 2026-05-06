# Discogs OAuth Backend

A small Flask service that handles the parts of the [Discogs OAuth 1.0a flow](https://www.discogs.com/developers#page:authentication,header:authentication-oauth-flow) that need the consumer secret. The Vue frontend talks to this service instead of `api.discogs.com` directly, so the secret never touches the browser.

## What it does

- Performs the three-step OAuth 1.0a handshake with Discogs (`request_token` → user authorizes → `access_token`).
- Stores the per-user access token in a server-side Flask session, keyed by a signed cookie.
- Exposes an authenticated proxy at `/api/discogs/<path>` that signs every Discogs API call on behalf of the signed-in user. Requests from unauthenticated visitors are forwarded unsigned, so public collections still work.

## Endpoints

| Method | Path                          | Description                                                                 |
| ------ | ----------------------------- | --------------------------------------------------------------------------- |
| GET    | `/api/auth/login`             | Returns `{ authorize_url }` — the URL the frontend should redirect to.      |
| GET    | `/api/auth/callback`          | Discogs redirects here. Exchanges the verifier and bounces back to the UI.  |
| GET    | `/api/auth/identity`          | Authenticated user's full Discogs identity (401 if not signed in).          |
| GET    | `/api/auth/status`            | `{ authenticated, username }` — cheap check for the frontend on page load.  |
| POST   | `/api/auth/logout`            | Clears the session.                                                         |
| ANY    | `/api/discogs/<path:subpath>` | Proxies to `https://api.discogs.com/<subpath>`, signed if the user is in.   |

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Then configure your environment. Copy `env.example.txt` to a `.env` file (or just export the variables) and fill in:

- `DISCOGS_CONSUMER_KEY` / `DISCOGS_CONSUMER_SECRET` — from <https://www.discogs.com/settings/developers>.
- `FRONTEND_ORIGIN` — where the Vue dev server lives (default `http://localhost:5173`).
- `BACKEND_BASE_URL` — public URL of this service (default `http://localhost:5000`). The OAuth callback is `${BACKEND_BASE_URL}/api/auth/callback` and **must** be registered as an allowed callback on your Discogs app.
- `FLASK_SECRET_KEY` — any long random string. Used to sign session cookies.

The code keeps placeholder values (`YOUR_DISCOGS_CONSUMER_KEY`, etc.) so it will start without configuration, but the OAuth handshake will fail until you provide real credentials.

## Run

```powershell
python app.py
```

This starts Flask on `http://127.0.0.1:5000` with debug mode on. For production, run it behind a real WSGI server (e.g. `waitress-serve --port=5000 app:app`) and set `FLASK_SECRET_KEY` to something random and persistent.

## Notes on signature method

This backend signs OAuth1 requests using the **PLAINTEXT** method (which Discogs supports). That keeps the implementation tiny and dependency-free. If you want HMAC-SHA1 instead, swap the `_oauth_auth_header` helper in `app.py` — the rest of the flow is unchanged.

## Cookie / CORS notes

- The Flask session uses a cookie. Because the frontend is on a different origin during dev (`localhost:5173` vs `localhost:5000`), the frontend must send credentialed requests (`fetch(..., { credentials: 'include' })`) and `flask-cors` is configured with `supports_credentials=True` and a single explicit origin.
- For production, serve the frontend and backend on the same origin (or under the same parent domain with a properly scoped cookie) so the session cookie behaves correctly.
