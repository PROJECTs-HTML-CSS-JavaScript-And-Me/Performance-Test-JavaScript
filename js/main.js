import { VIEWS } from './routes.js'
import * as auth from './login.js'
import * as tasksService from './tasks.js'
import * as api from './api.js'
import * as profileService from './profile.js'

// Cargar vista por ruta
async function loadView(path) {
  try {
    const res = await fetch(path)
    if (!res.ok) throw new Error(`Error ${res.status}: no se pudo cargar ${path}`)
    const html = await res.text()
    document.getElementById('app').innerHTML = html

    // Aplicar clase al body según la vista
    document.body.className = ''
    if (path === VIEWS.TASKS || path === VIEWS.MY_TASK || path === VIEWS.CREATE_TASK) {
      document.body.classList.add('tasks-view')
      if (path === VIEWS.TASKS) initTasks()
      if (path === VIEWS.MY_TASK) initMyTask()
      if (path === VIEWS.CREATE_TASK) initCreateTask()
    } else if (path === VIEWS.PROFILE) {
      document.body.classList.add('tasks-view')
      initProfile()
    } else {
      document.body.classList.add('auth-view')
      if (path === VIEWS.LOGIN) initLogin()
      if (path === VIEWS.REGISTER) initRegister()
    }
  } catch (err) {
    console.error('Error al cargar vista:', err)
    document.getElementById('app').innerHTML = `<h1> Error al cargar la vista </h1> <p>${err.message}</p>`
  }
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  const session = auth.getSession()
  console.log('Sesión:', session)
  if (session) {
    loadView(VIEWS.TASKS)
  } else {
    loadView(VIEWS.LOGIN)
  }
})

// ---------- Login view ----------
function initLogin() {
  const form = document.getElementById('login-form')
  const linkRegister = document.getElementById('link-register')
  const togglePassword = document.getElementById('toggle-password')

  if (togglePassword) {
    togglePassword.addEventListener('click', (e) => {
      e.preventDefault()
      const passwordInput = document.getElementById('password')
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password'
      passwordInput.setAttribute('type', type)
    })
  }

  if (linkRegister) linkRegister.addEventListener('click', (e) => {
    e.preventDefault()
    loadView(VIEWS.REGISTER)
  })

  if (!form) return
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    try {
      const user = await auth.loginUser({ email, password })
      auth.saveSession(user)
      loadView(VIEWS.TASKS)
    } catch (err) {
      alert(err.message)
    }
  })
}

// ---------- Register view ----------
function initRegister() {
  const form = document.getElementById('register-form')
  const linkSignin = document.getElementById('link-signin')
  if (linkSignin) linkSignin.addEventListener('click', (e) => {
    e.preventDefault()
    loadView(VIEWS.LOGIN)
  })

  if (!form) return
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fullname = document.getElementById('fullname').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirm = document.getElementById('confirm-password').value

    if (password !== confirm) return alert('Las contraseñas no coinciden')

    try {
      await auth.registerUser({ fullname, email, password })
      alert('Registro exitoso. Ya puedes iniciar sesión')
      loadView(VIEWS.LOGIN)
    } catch (err) {
      alert(err.message)
    }
  })
}

// ---------- Tasks view ----------
function initTasks() {
  const user = auth.getSession()
  if (!user) return loadView(VIEWS.LOGIN)

  let allTasks = []
  let currentFilter = 'all'
  let searchTerm = ''

  const userEmail = document.getElementById('user-email')
  const logoutBtn = document.getElementById('logout-btn')
  const newTaskBtn = document.querySelector('.new-task-btn')
  const tabsButtons = document.querySelectorAll('.tab')
  const searchInput = document.querySelector('.search-input')

  if (!userEmail || !logoutBtn) {
    console.error('Elementos requeridos no encontrados en tasks.html')
    return
  }

  userEmail.textContent = user.email
  logoutBtn.addEventListener('click', () => { auth.logout(); loadView(VIEWS.LOGIN) })
  newTaskBtn?.addEventListener('click', (e) => { 
    e.preventDefault()
    loadView(VIEWS.CREATE_TASK) 
  })

  // Sidebar navigation handlers
  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      navItems.forEach(nav => nav.classList.remove('active'))
      item.classList.add('active')
      
      const navText = item.querySelector('.nav-icon')?.closest('.nav-item').textContent?.trim() || ''
      if (navText.includes('Dashboard')) {
        loadView(VIEWS.TASKS)
      } else if (navText.includes('My Tasks')) {
        loadView(VIEWS.MY_TASK)
      } else if (navText.includes('Profile')) {
        loadView(VIEWS.PROFILE)
      }
    })
  })

  
  tabsButtons.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabsButtons.forEach(t => t.classList.remove('active'))
      e.target.classList.add('active')
      currentFilter = e.target.dataset.filter
      renderTasks()
    })
  })

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase()
    renderTasks()
  })

  renderTasks()

  async function renderTasks() {
    try {
      allTasks = await tasksService.getTasksByUser(user.id)
      
      // Update stats
      updateStats(allTasks)
      
      // Filter tasks
      let filtered = allTasks
      if (currentFilter === 'completed') {
        filtered = allTasks.filter(t => t.completed)
      } else if (currentFilter === 'pending') {
        filtered = allTasks.filter(t => !t.completed)
      }
      
      if (searchTerm) {
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(searchTerm) ||
          (t.description && t.description.toLowerCase().includes(searchTerm))
        )
      }
      
      const tbody = document.getElementById('tasks-table-body')
      if (!filtered.length) {
        tbody.innerHTML = '<tr> <td colspan="5" style="text-align: center; padding: 20px; color: #6b7280;">No tasks found </td> </tr>'
        return
      }

      tbody.innerHTML = filtered.map(t => {
        const dueDate = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'
        const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
        const priority = t.priority || 'Medium'
        
        return `<tr data-id="${t.id}">
          <td>
            <input type="checkbox" class="toggle-completed" ${t.completed ? 'checked' : ''}>
            <strong style="margin-left: 10px;">${t.title}</strong>
          </td>
          <td>
            <span class="status-badge status-${t.completed ? 'completed' : 'pending'}">
              ${t.completed ? 'Completed' : 'Pending'}
            </span>
          </td>
          <td>
            <div class="priority-badge priority-${priority.toLowerCase()}">
              <div class="priority-dot"></div>
              <span>${priority}</span>
            </div>
          </td>
          <td>
            <span class="due-date ${isOverdue ? 'overdue' : ''}">
              ${dueDate}
            </span>
          </td>
          <td>
            <div class="actions">
              <button class="action-btn edit-btn" data-id="${t.id}" title="Edit">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button class="action-btn delete-btn" data-id="${t.id}" title="Delete">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>`
      }).join('')

      // Attach event listeners using delegation
      tbody.addEventListener('change', async (e) => {
        if (e.target.classList.contains('toggle-completed')) {
          const id = e.target.closest('tr').dataset.id
          const task = allTasks.find(t => String(t.id) === String(id))
          if (task) {
            await tasksService.updateTask(id, { ...task, completed: e.target.checked })
            renderTasks()
          }
        }
      })

      tbody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn')
        const editBtn = e.target.closest('.edit-btn')

        if (deleteBtn) {
          e.preventDefault()
          e.stopPropagation()
          const id = deleteBtn.dataset.id
          console.log('Delete clicked for id:', id)
          if (confirm('¿Eliminar tarea?')) {
            tasksService.deleteTask(id).then(() => {
              console.log('Task deleted, reloading...')
              renderTasks()
            }).catch(err => {
              alert('Error deleting task: ' + err.message)
            })
          }
        }

        if (editBtn) {
          e.preventDefault()
          e.stopPropagation()
          const id = editBtn.dataset.id
          const task = allTasks.find(t => String(t.id) === String(id))
          if (task) {
            sessionStorage.setItem('editTask', JSON.stringify(task))
            loadView(VIEWS.CREATE_TASK)
          }
        }
      })

    } catch (err) {
      console.error('Error rendering tasks:', err)
      const tbody = document.getElementById('tasks-table-body')
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #ef4444;">Error: ${err.message}</td></tr>`
    }
  }

  function updateStats(tasks) {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    document.getElementById('stat-total').textContent = total
    document.getElementById('stat-completed').textContent = completed
    document.getElementById('stat-pending').textContent = pending
    document.getElementById('stat-progress').textContent = progress + '%'
  }

  function showCreateModal() {
    const title = prompt('Task title:')
    if (!title) return

    const description = prompt('Task description:')
    const dueDate = prompt('Due date (YYYY-MM-DD):')

    createTask(title, description, dueDate)
  }

  function showEditModal(task) {
    const title = prompt('Task title:', task.title)
    if (!title) return

    const description = prompt('Task description:', task.description || '')
    const dueDate = prompt('Due date (YYYY-MM-DD):', task.dueDate || '')

    updateTask(task.id, title, description, dueDate, task.completed)
  }

  async function createTask(title, description, dueDate) {
    try {
      await tasksService.createTask({
        userId: user.id,
        title,
        description: description || '',
        dueDate: dueDate || null,
        completed: false,
        priority: 'Medium'
      })
      renderTasks()
    } catch (err) {
      alert('Error updating task: ' + err.message)
    }
  }
}

// ---------- My Task view ----------
function initMyTask() {
  const user = auth.getSession()
  if (!user) return loadView(VIEWS.LOGIN)

  let allTasks = []
  let currentFilter = 'all'
  let searchTerm = ''

  const userEmail = document.getElementById('user-email')
  const logoutBtn = document.getElementById('logout-btn')
  const newTaskBtn = document.querySelector('.new-task-btn')
  const tabsButtons = document.querySelectorAll('.tab')
  const searchInput = document.querySelector('.search-input')

  if (!userEmail || !logoutBtn) {
    console.error('Elementos requeridos no encontrados en my_task.html')
    return
  }

  userEmail.textContent = user.email
  logoutBtn.addEventListener('click', () => { auth.logout(); loadView(VIEWS.LOGIN) })
  newTaskBtn?.addEventListener('click', (e) => { 
    e.preventDefault()
    loadView(VIEWS.CREATE_TASK) 
  })

  // Sidebar navigation handlers
  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      navItems.forEach(nav => nav.classList.remove('active'))
      item.classList.add('active')
      
      const navText = item.textContent.trim() || ''
      if (navText.includes('Dashboard')) {
        loadView(VIEWS.TASKS)
      } else if (navText.includes('My Tasks')) {
        loadView(VIEWS.MY_TASK)
      } else if (navText.includes('Profile')) {
        console.log('Profile view not implemented yet')
      }
    })
  })

  tabsButtons.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabsButtons.forEach(t => t.classList.remove('active'))
      e.target.classList.add('active')
      currentFilter = e.target.dataset.filter
      renderTasks()
    })
  })

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase()
    renderTasks()
  })

  renderTasks()

  async function renderTasks() {
    try {
      allTasks = await tasksService.getTasksByUser(user.id)
      
      // Update stats
      updateStats(allTasks)
      
      // Filter tasks
      let filtered = allTasks
      if (currentFilter === 'completed') {
        filtered = allTasks.filter(t => t.completed)
      } else if (currentFilter === 'pending') {
        filtered = allTasks.filter(t => !t.completed)
      }
      
      if (searchTerm) {
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(searchTerm) ||
          (t.description && t.description.toLowerCase().includes(searchTerm))
        )
      }
      
      const tbody = document.getElementById('tasks-table-body')
      if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #6b7280;">No tasks found</td></tr>'
        return
      }

      tbody.innerHTML = filtered.map(t => {
        const dueDate = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'
        const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
        const priority = t.priority || 'Medium'
        
        return `<tr data-id="${t.id}">
          <td>
            <input type="checkbox" class="toggle-completed" ${t.completed ? 'checked' : ''}>
            <strong style="margin-left: 10px;">${t.title}</strong>
          </td>
          <td>
            <span class="status-badge status-${t.completed ? 'completed' : 'pending'}">
              ${t.completed ? 'Completed' : 'Pending'}
            </span>
          </td>
          <td>
            <div class="priority-badge priority-${priority.toLowerCase()}">
              <div class="priority-dot"></div>
              <span>${priority}</span>
            </div>
          </td>
          <td>
            <span class="due-date ${isOverdue ? 'overdue' : ''}">
              ${dueDate}
            </span>
          </td>
        </tr>`
      }).join('')

      // Attach event listeners using delegation
      tbody.addEventListener('change', async (e) => {
        if (e.target.classList.contains('toggle-completed')) {
          const id = e.target.closest('tr').dataset.id
          const task = allTasks.find(t => String(t.id) === String(id))
          if (task) {
            await tasksService.updateTask(id, { ...task, completed: e.target.checked })
            renderTasks()
          }
        }
      })

      tbody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn')
        const editBtn = e.target.closest('.edit-btn')

        if (deleteBtn) {
          e.preventDefault()
          e.stopPropagation()
          const id = deleteBtn.dataset.id
          console.log('Delete clicked for id:', id)
          if (confirm('¿Eliminar tarea?')) {
            tasksService.deleteTask(id).then(() => {
              console.log('Task deleted, reloading...')
              renderTasks()
            }).catch(err => {
              alert('Error deleting task: ' + err.message)
            })
          }
        }

        if (editBtn) {
          e.preventDefault()
          e.stopPropagation()
          const id = editBtn.dataset.id
          const task = allTasks.find(t => String(t.id) === String(id))
          if (task) {
            sessionStorage.setItem('editTask', JSON.stringify(task))
            loadView(VIEWS.CREATE_TASK)
          }
        }
      })

    } catch (err) {
      console.error('Error rendering tasks:', err)
      const tbody = document.getElementById('tasks-table-body')
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #ef4444;">Error: ${err.message}</td></tr>`
    }
  }

  function updateStats(tasks) {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    document.getElementById('stat-total').textContent = total
    document.getElementById('stat-completed').textContent = completed
    document.getElementById('stat-pending').textContent = pending
    document.getElementById('stat-progress').textContent = progress + '%'
  }
}

// ---------- Create Task view ----------
function initCreateTask() {
  const user = auth.getSession()
  if (!user) return loadView(VIEWS.LOGIN)

  const userEmail = document.getElementById('user-email')
  const logoutBtn = document.getElementById('logout-btn')
  const backBtn = document.getElementById('back-to-tasks')
  const cancelBtn = document.getElementById('cancel-btn')
  const form = document.getElementById('task-form')

  if (!userEmail || !logoutBtn || !form) {
    console.error('Elementos requeridos no encontrados en create_task.html')
    return
  }

  userEmail.textContent = user.email
  logoutBtn.addEventListener('click', () => { auth.logout(); loadView(VIEWS.LOGIN) })
  backBtn?.addEventListener('click', (e) => { e.preventDefault(); loadView(VIEWS.TASKS) })
  cancelBtn?.addEventListener('click', (e) => { e.preventDefault(); loadView(VIEWS.TASKS) })

  // If editing, populate form
  const editTaskData = sessionStorage.getItem('editTask')
  if (editTaskData) {
    const task = JSON.parse(editTaskData)
    document.getElementById('task-id').value = task.id
    document.getElementById('task-title').value = task.title
    document.getElementById('description').value = task.description || ''
    document.getElementById('due-date').value = task.dueDate ? task.dueDate.split('T')[0] : ''
    document.getElementById('priority').value = task.priority || 'Medium'
    document.getElementById('category').value = task.category || ''
    document.getElementById('status').value = task.completed ? 'Completed' : 'Pending'

    // Clear edit data from sessionStorage
    sessionStorage.removeItem('editTask')
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const taskId = document.getElementById('task-id').value
    const title = document.getElementById('task-title').value
    const description = document.getElementById('description').value
    const dueDate = document.getElementById('due-date').value
    const priority = document.getElementById('priority').value
    const category = document.getElementById('category').value
    const status = document.getElementById('status').value

    if (!title.trim()) {
      alert('Task title is required')
      return
    }

    try {
      if (taskId) {
        // Update existing task
        const task = await tasksService.getTasksByUser(user.id)
        const existing = task.find(t => String(t.id) === String(taskId))
        if (existing) {
          await tasksService.updateTask(taskId, {
            userId: user.id,
            title,
            description,
            dueDate: dueDate || null,
            completed: status === 'Completed',
            priority,
            category
          })
        }
      } else {
        // Create new task
        await tasksService.createTask({
          userId: user.id,
          title,
          description,
          dueDate: dueDate || null,
          completed: false,
          priority,
          category
        })
      }
      alert('Task saved successfully')
      loadView(VIEWS.TASKS)
    } catch (err) {
      alert('Error saving task: ' + err.message)
    }
  })
}

// ---------- Profile view ----------
function initProfile() {
  const user = auth.getSession()
  if (!user) return loadView(VIEWS.LOGIN)

  const userEmail = document.getElementById('user-email')
  const logoutBtn = document.getElementById('logout-btn')
  const form = document.getElementById('profile-form')

  if (!userEmail || !logoutBtn || !form) {
    console.error('Elementos requeridos no encontrados en profile.html')
    return
  }

  userEmail.textContent = user.email
  logoutBtn.addEventListener('click', () => { auth.logout(); loadView(VIEWS.LOGIN) })

  // Load current user data
  profileService.getUserProfile(user.id).then(profile => {
    document.getElementById('fullname').value = profile.fullname
    document.getElementById('email').value = profile.email
  }).catch(err => {
    console.error('Error loading profile:', err)
    alert('Error loading profile: ' + err.message)
  })

  // Sidebar navigation handlers
  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      navItems.forEach(nav => nav.classList.remove('active'))
      item.classList.add('active')

      const navText = item.querySelector('.nav-icon')?.closest('.nav-item').textContent?.trim() || ''
      if (navText.includes('Dashboard')) {
        loadView(VIEWS.TASKS)
      } else if (navText.includes('My Tasks')) {
        loadView(VIEWS.MY_TASK)
      } else if (navText.includes('Profile')) {
        loadView(VIEWS.PROFILE)
      }
    })
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const fullname = document.getElementById('fullname').value
    const email = document.getElementById('email').value
    const currentPassword = document.getElementById('current-password').value
    const newPassword = document.getElementById('new-password').value
    const confirmPassword = document.getElementById('confirm-password').value

    if (!fullname.trim() || !email.trim() || !currentPassword.trim()) {
      alert('Full name, email, and current password are required')
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }

    try {
      // Update profile
      await profileService.updateUserProfile(user.id, { fullname, email })

      // Change password if provided
      if (newPassword) {
        await profileService.changePassword(user.id, currentPassword, newPassword)
      }

      // Update session
      const updatedUser = { ...user, fullname, email }
      auth.saveSession(updatedUser)

      alert('Profile updated successfully')
      loadView(VIEWS.PROFILE) // Reload to show updated data
    } catch (err) {
      alert('Error updating profile: ' + err.message)
    }
  })
}