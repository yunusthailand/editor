export const apiUrl = import.meta.env.VITE_BACKEND_URL;

// One place that turns a fetch into either parsed JSON or a thrown Error, so
// every query/mutation reports failures the same way. The server sends an
// actionable `message` on 4xx (e.g. the reassign-required 409) — surface it
// rather than a generic status string.
export async function apiFetch(path, options) {
  const res = await fetch(`${apiUrl}${path}`, options);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}
