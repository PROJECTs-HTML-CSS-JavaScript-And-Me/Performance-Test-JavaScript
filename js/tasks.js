import * as api from './api.js'

export function getTasksByUser(userId) {
  return api.get(`/tasks`, `?userId=${userId}`)
}

export function createTask(task) {
  return api.post('/tasks', task)
}

export function updateTask(id, task) {
  return api.put(`/tasks/${id}`, task)
}

export function deleteTask(id) {
  return api.del(`/tasks/${id}`)
}
