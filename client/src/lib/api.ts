const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const CUSTOMER_TOKEN_KEY = 'lp_customer_token';
export const ADMIN_TOKEN_KEY = 'lp_admin_token';

export interface ApiFetchOptions extends RequestInit {
  asAdmin?: boolean;
}

export async function apiFetch(endpoint: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { asAdmin, headers: customHeaders, ...restOptions } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const headers = new Headers(customHeaders || {});
  if (!headers.has('Content-Type') && !(restOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach appropriate token
  const isAdminRequest = asAdmin || endpoint.startsWith('/api/admin');
  const token = isAdminRequest
    ? localStorage.getItem(ADMIN_TOKEN_KEY)
    : localStorage.getItem(CUSTOMER_TOKEN_KEY);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  // Clear session on 401 Unauthorized
  if (response.status === 401) {
    if (isAdminRequest) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('lp:admin_session_expired'));
    } else {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('lp:customer_session_expired'));
    }
  }

  return response;
}

export const api = {
  get: (endpoint: string, options?: ApiFetchOptions) =>
    apiFetch(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body?: any, options?: ApiFetchOptions) =>
    apiFetch(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    }),
  put: (endpoint: string, body?: any, options?: ApiFetchOptions) =>
    apiFetch(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    }),
  delete: (endpoint: string, options?: ApiFetchOptions) =>
    apiFetch(endpoint, { ...options, method: 'DELETE' }),
};
