import * as api from './api.js'

export async function getUserProfile(userId) {
  const users = await api.get('/users', `?id=${userId}`)
  if (users.length === 0) throw new Error('User not found')
  return users[0]
}

export async function updateUserProfile(userId, updates) {
  const user = await getUserProfile(userId)
  const updatedUser = { ...user, ...updates }
  return await api.put(`/users/${userId}`, updatedUser)
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await getUserProfile(userId)
  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect')
  }
  return await updateUserProfile(userId, { password: newPassword })
}
