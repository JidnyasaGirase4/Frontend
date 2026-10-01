// By default the browser talks to "/api" and Vite proxies it (and "/uploads") to the Node backend in
// ../Backend. Set VITE_API_URL to a full URL (e.g. https://api.example.com/api) to call a remote API.
const API_BASE = import.meta.env.VITE_API_URL || '/api'
const API_ORIGIN = /^https?:\/\//.test(API_BASE) ? new URL(API_BASE).origin : ''

const TOKEN_KEY = 'ignite-admin-token'

export const auth = {
  get token() {
    return localStorage.getItem(TOKEN_KEY)
  },
  set(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

// Uploaded files are served by the backend at /uploads/... — point them at the API origin when it is remote.
export function assetUrl(src) {
  return typeof src === 'string' && src.startsWith('/uploads/') ? `${API_ORIGIN}${src}` : src
}

function resolveAssets(value) {
  if (!API_ORIGIN) return value
  if (typeof value === 'string') return assetUrl(value)
  if (Array.isArray(value)) return value.map(resolveAssets)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveAssets(v)]))
  }
  return value
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  const { admin, body, ...rest } = options
  const headers = { ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}) }
  if (admin && auth.token) headers.Authorization = `Bearer ${auth.token}`

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    if (admin && res.status === 401) {
      auth.clear()
      window.dispatchEvent(new Event('ignite-admin-signout'))
    }
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status)
  }
  return resolveAssets(data)
}

export const api = {
  getContent: () => request('/content'),
  getServices: () => request('/services'),
  getService: (slug) => request(`/services/${slug}`),
  getProjects: () => request('/projects'),
  getMedia: () => request('/media'),
  getTestimonials: () => request('/testimonials'),
  getBlogPosts: () => request('/blog'),
  getBlogPost: (slug) => request(`/blog/${slug}`),
  getAbout: () => request('/about'),
  submitEnquiry: (payload) => request('/enquiries', { method: 'POST', body: payload }),
  submitContact: (payload) => request('/contact', { method: 'POST', body: payload }),
  subscribe: (email) => request('/subscribe', { method: 'POST', body: { email } }),
}

export const adminApi = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me', { admin: true }),
  changePassword: (payload) => request('/auth/change-password', { method: 'POST', body: payload, admin: true }),
  dashboard: () => request('/admin/dashboard', { admin: true }),
  badges: () => request('/admin/badges', { admin: true }),
  getContent: (key) => request(`/admin/content/${key}`, { admin: true }),
  saveContent: (key, data) => request(`/admin/content/${key}`, { method: 'PUT', body: data, admin: true }),
  list: (resource) => request(`/admin/${resource}`, { admin: true }),
  create: (resource, data) => request(`/admin/${resource}`, { method: 'POST', body: data, admin: true }),
  update: (resource, id, data) => request(`/admin/${resource}/${id}`, { method: 'PUT', body: data, admin: true }),
  setStatus: (resource, id, status) => request(`/admin/${resource}/${id}`, { method: 'PATCH', body: { status }, admin: true }),
  remove: (resource, id) => request(`/admin/${resource}/${id}`, { method: 'DELETE', admin: true }),
  upload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return request('/admin/upload', { method: 'POST', body: form, admin: true })
  },
}
