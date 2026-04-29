const BASE = '/api'
const TOKEN_KEY = 'payload-token'

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null)

async function req(path, opts = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
      ...opts.headers,
    },
    ...opts,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

// Auth
export const login = async (email, password) => {
  const data = await req('/users/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  if (data?.token) localStorage.setItem(TOKEN_KEY, data.token)
  return data
}

export const logout = async () => {
  localStorage.removeItem(TOKEN_KEY)
  return req('/users/logout', { method: 'POST' })
}

export const getMe = () => req('/users/me')

// Collections
export const getCollection = (slug, params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req(`/${slug}${qs ? `?${qs}` : ''}`)
}

export const getDoc = (slug, id) => req(`/${slug}/${id}`)

export const createDoc = (slug, data) =>
  req(`/${slug}`, { method: 'POST', body: JSON.stringify(data) })

export const updateDoc = (slug, id, data) =>
  req(`/${slug}/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteDoc = (slug, id) =>
  req(`/${slug}/${id}`, { method: 'DELETE' })

// Globals
export const getGlobal = (slug) => req(`/globals/${slug}`)

export const updateGlobal = (slug, data) =>
  req(`/globals/${slug}`, { method: 'POST', body: JSON.stringify(data) })
