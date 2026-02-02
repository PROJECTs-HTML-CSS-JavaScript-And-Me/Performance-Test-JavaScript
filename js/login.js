import * as api from './api.js'

export async function registerUser({ fullname, email, password }) {
  // verificar si ya existe
  const existing = await api.get('/users', `?email=${encodeURIComponent(email)}`)
  if (existing.length) throw new Error('El email ya está registrado')

  const user = await api.post('/users', { fullname, email, password })
  return user
}

export async function loginUser({ email, password }) {
  const users = await api.get('/users', `?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
  if (users.length === 0) throw new Error('Credenciales inválidas')
  return users[0]
}

export function saveSession(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getSession() {
  const s = localStorage.getItem('user')
  return s ? JSON.parse(s) : null
}

export function logout() {
  localStorage.removeItem('user')
}