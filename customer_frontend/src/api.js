/**
 * API helper for communicating with the Django backend.
 * Uses session-based authentication (send cookies) via credentials: 'include'.
 * Configure API base URL via REACT_APP_API_BASE (defaults to '').
 */

const API_BASE = process.env.REACT_APP_API_BASE || '';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include', // critical for session auth
    ...options,
  });

  // Try parse JSON, but tolerate empty response bodies
  let data = null;
  const text = await resp.text();
  if (text) {
    try { data = JSON.parse(text); } catch (_) { data = text; }
  }

  if (!resp.ok) {
    const err = new Error((data && data.detail) || data?.error || 'Request failed');
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function apiLogin(username, password) {
  /** Authenticate with username and password against /auth/login/ */
  return request('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

// PUBLIC_INTERFACE
export async function apiLogout() {
  /** Logout current session via /auth/logout/ */
  return request('/api/auth/logout/', { method: 'POST' });
}

// PUBLIC_INTERFACE
export async function apiHealth() {
  /** Check backend health endpoint */
  return request('/api/health/', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiListCustomers() {
  /** Get customers array from /customers/ */
  return request('/api/customers/', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiGetCustomer(id) {
  /** Get single customer by id from /customers/{id}/ */
  return request(`/api/customers/${id}/`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiCreateCustomer(payload) {
  /** Create a new customer (auth required) */
  return request('/api/customers/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// PUBLIC_INTERFACE
export async function apiUpdateCustomer(id, payload) {
  /** Update an existing customer (auth required) */
  return request(`/api/customers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

// PUBLIC_INTERFACE
export async function apiDeleteCustomer(id) {
  /** Delete a customer by id (auth required) */
  return request(`/api/customers/${id}/`, { method: 'DELETE' });
}
