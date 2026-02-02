const API_BASE = 'http://localhost:3000'

export async function get(path, query = '') {
  const url = `${API_BASE}${path}${query}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export async function post(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export async function put(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export async function del(path) {
  const res = await fetch(API_BASE + path, { method: 'DELETE' })
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}
