/**
 * Talks to the LAGOS-CBT server. All data and logins now live on the server.
 */
const TOKEN_KEY = 'civil_cbt_token_v1';
export const CURRENT_USER_KEY = 'civil_cbt_current_user_v5';

export class ApiError extends Error {
  constructor(message, status = 0, code = '') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function saveUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * api('/path', { method, body, auth })
 * auth:false is for login/register (a wrong password must not count as an expired session).
 * If the server says the session is gone (e.g. signed in elsewhere), a 'cbt:session-ended'
 * event is fired so the app can return to the home screen.
 */
export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0, 'NETWORK');
  }

  const contentType = res.headers.get('content-type') || '';
  let data = null;

  // Protect against static host SPA rewrites returning index.html for unknown /api/* routes
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    // If the response is HTML or text, it is not a valid API endpoint
    throw new ApiError(`Unexpected response format from server (${res.status})`, res.status, 'NON_JSON');
  }

  if (!res.ok) {
    if (res.status === 401 && auth && getToken()) {
      clearSession();
      window.dispatchEvent(new CustomEvent('cbt:session-ended', { detail: { code: data?.code } }));
    }
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status, data?.code || '');
  }

  return data;
}