export const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Same key AdminContext used on the frontend, so nothing else about the auth
// system (backend env vars, JWT shape) has to change — only where the token
// is read from moves.
export const TOKEN_KEY = "adminToken";

// One place that turns a fetch into either parsed JSON or a thrown Error, so
// every query/mutation reports failures the same way. The server sends an
// actionable `message` on 4xx (e.g. the reassign-required 409) — surface it
// rather than a generic status string.
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${apiUrl}${path}`, { ...options, headers });

  // The token is currently only checked on /auth routes, but if a protected
  // route ever starts enforcing it, a stale/expired token shouldn't leave the
  // editor stuck retrying — send the user back to a fresh login.
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}
