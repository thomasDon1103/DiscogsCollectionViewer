import type { DiscogsCollectionResponse } from '../types/DiscogsCollectionInfo';
import type { DiscogsAlbumInfoResponse } from '../types/DiscogsAlbumInfo';

// ============================================================================
// Backend configuration
//
// All Discogs traffic now goes through our Flask backend, which handles the
// OAuth flow (so the consumer secret never reaches the browser) and acts as a
// signed proxy to api.discogs.com. The backend exposes:
//
//   GET  /api/auth/login           -> { authorize_url }
//   GET  /api/auth/callback        -> 302 back to the frontend
//   GET  /api/auth/identity        -> Discogs identity object (or 401)
//   GET  /api/auth/status          -> { authenticated, username }
//   POST /api/auth/logout          -> { ok: true }
//   ANY  /api/discogs/<subpath>    -> proxied to https://api.discogs.com/<subpath>
//
// Set VITE_BACKEND_BASE_URL in a .env file to override the default.
// ============================================================================

export const BACKEND_BASE_URL: string =
  (import.meta as any).env?.VITE_BACKEND_BASE_URL ?? 'http://localhost:5000';

/**
 * Thrown when the backend itself is unreachable (network error, CORS failure,
 * server down). Distinct from "the backend responded with an HTTP error" so the
 * UI can show a clearer message.
 */
export class BackendUnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackendUnreachableError';
  }
}

async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = `${BACKEND_BASE_URL}${path}`;
  try {
    return await fetch(url, {
      // Always send the session cookie so the backend can identify the user.
      credentials: 'include',
      ...init,
    });
  } catch (err) {
    // fetch() only rejects on network-level failures (DNS, refused
    // connection, CORS preflight failure, etc.). Treat all of these as
    // "backend unreachable" so the UI can show a friendly message.
    throw new BackendUnreachableError(
      `Could not reach backend at ${BACKEND_BASE_URL}. ` +
        `Make sure the Flask server is running. (${(err as Error).message})`,
    );
  }
}

async function extractError(response: Response): Promise<string> {
  const body = await response.text();
  try {
    const json = JSON.parse(body);
    return json.error || json.message || body;
  } catch {
    return body;
  }
}

// ============================================================================
// In-memory auth state
//
// Authentication itself lives in the backend session cookie. We keep a tiny
// cached copy of `{ authenticated, username }` here so synchronous getters
// (used by the form) can stay synchronous. Call `discogsAuth.refreshStatus()`
// to re-sync from the backend.
// ============================================================================

let cachedAuthenticated = false;
let cachedUsername: string | null = null;

export interface DiscogsIdentity {
  id: number;
  username: string;
  resource_url: string;
  consumer_name: string;
}

export interface AuthStatus {
  authenticated: boolean;
  username: string | null;
}

export const discogsAuth = {
  /**
   * Ask the backend for an authorize URL and send the browser there. The user
   * will come back to the backend's /api/auth/callback, which finishes the
   * handshake and 302s them back to this app with `?discogs_auth=success`.
   */
  async beginLogin(): Promise<void> {
    const res = await backendFetch('/api/auth/login');
    if (!res.ok) {
      throw new Error(
        `Failed to start Discogs login (HTTP ${res.status}): ${await extractError(res)}`,
      );
    }
    const data = (await res.json()) as { authorize_url?: string };
    if (!data.authorize_url) {
      throw new Error('Backend did not return an authorize_url');
    }
    window.location.href = data.authorize_url;
  },

  /**
   * After the backend redirects the browser back to the SPA, the URL contains
   * `?discogs_auth=success` (or `=error`). This helper detects that.
   */
  hasCallbackParams(): boolean {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('discogs_auth');
  },

  /**
   * Process the post-login redirect: refresh auth status from the backend,
   * strip the query params from the URL, and return the resulting identity
   * (or throw if the backend reported an error).
   */
  async completeLogin(): Promise<DiscogsIdentity> {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('discogs_auth');
    const reason = params.get('reason');

    // Always strip the OAuth params from the URL so a refresh doesn't replay.
    const cleanUrl =
      window.location.origin +
      window.location.pathname +
      window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);

    if (result !== 'success') {
      throw new Error(
        `Discogs login failed${reason ? ` (${reason})` : ''}. Please try again.`,
      );
    }

    return await discogsAuth.fetchIdentity();
  },

  /**
   * Fetch the authenticated user's full Discogs identity from the backend.
   * Throws if not signed in (HTTP 401) or if the backend is unreachable.
   */
  async fetchIdentity(): Promise<DiscogsIdentity> {
    const res = await backendFetch('/api/auth/identity');
    if (res.status === 401) {
      cachedAuthenticated = false;
      cachedUsername = null;
      throw new Error('Not authenticated with Discogs');
    }
    if (!res.ok) {
      throw new Error(
        `Failed to fetch Discogs identity (HTTP ${res.status}): ${await extractError(res)}`,
      );
    }
    const identity = (await res.json()) as DiscogsIdentity;
    cachedAuthenticated = true;
    cachedUsername = identity.username;
    return identity;
  },

  /**
   * Cheap status check the frontend runs on page load to figure out whether
   * the user already has a session.
   */
  async refreshStatus(): Promise<AuthStatus> {
    const res = await backendFetch('/api/auth/status');
    if (!res.ok) {
      throw new Error(
        `Failed to query auth status (HTTP ${res.status}): ${await extractError(res)}`,
      );
    }
    const data = (await res.json()) as AuthStatus;
    cachedAuthenticated = !!data.authenticated;
    cachedUsername = data.username ?? null;
    return data;
  },

  /** Tear down the session on the backend. */
  async logout(): Promise<void> {
    try {
      await backendFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      cachedAuthenticated = false;
      cachedUsername = null;
    }
  },

  // ---- Synchronous accessors backed by the in-memory cache ---------------
  isAuthenticated(): boolean {
    return cachedAuthenticated;
  },

  getAuthenticatedUsername(): string | null {
    return cachedUsername;
  },
};

// ============================================================================
// Discogs API proxy calls
//
// These all go through the backend, which transparently signs the request
// with the user's OAuth token if they're signed in. Public collections still
// work for unauthenticated visitors.
// ============================================================================

function buildProxyUrl(subpath: string, params?: URLSearchParams): string {
  const trimmed = subpath.replace(/^\/+/, '');
  const qs = params && params.toString() ? `?${params.toString()}` : '';
  return `/api/discogs/${trimmed}${qs}`;
}

async function proxiedFetch(
  subpath: string,
  params?: URLSearchParams,
  apiKey?: string,
): Promise<Response> {
  const headers: Record<string, string> = {};
  // The legacy "personal access token" field is still honored: forward it as
  // a header that the backend can use as a fallback when the user hasn't gone
  // through OAuth.
  if (apiKey) headers['X-Discogs-Token'] = apiKey;

  return backendFetch(buildProxyUrl(subpath, params), { headers });
}

export const discogsService = {
  /**
   * Fetch a single page of a user's Discogs collection.
   */
  async fetchCollectionPage(
    username: string,
    page: number = 1,
    apiKey?: string,
  ): Promise<DiscogsCollectionResponse> {
    if (!username) {
      throw new Error('Username is required');
    }

    const params = new URLSearchParams({
      page: String(page),
      per_page: '100',
      sort: 'artist',
      sort_order: 'asc',
    });

    const response = await proxiedFetch(
      `users/${encodeURIComponent(username)}/collection/folders/0/releases`,
      params,
      apiKey,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch collection (HTTP ${response.status}): ${await extractError(response)}`,
      );
    }

    return (await response.json()) as DiscogsCollectionResponse;
  },

  /**
   * Fetch a single album's details from Discogs.
   */
  async fetchAlbumInfo(
    albumID: number = 1,
  ): Promise<DiscogsAlbumInfoResponse> {
    const response = await proxiedFetch(
      `releases/${encodeURIComponent(albumID)}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch album info (HTTP ${response.status}): ${await extractError(response)}`,
      );
    }

    return (await response.json()) as DiscogsAlbumInfoResponse;
  },
};

export default discogsService;