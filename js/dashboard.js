// dashboard.js - Dashboard de usuario

let currentUser = null;
let allTasks = [];
let filteredTasks = [];
let currentFilter = 'all';

// Inicializar dashboard
async function initDashboard() {
    // Verificar autenticación
    if (!checkUserAuth()) return;
    // Obtener usuario actual
    currentUser = session.get();
    // Cargar datos
    await loadUserData();
    await loadTasks();
    // Renderizar UI
    renderUserInfo();
    renderStats();
    renderTasksTable();
    // Configurar event listeners
    setupEventListeners();
}

// Cargar datos del usuario
async function loadUserData() {
    try {
        const user = await api.get(API_ENDPOINTS.users, currentUser.id);
        currentUser = user;
        session.save(user);
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

// Cargar tareas
async function loadTasks() {
    try {
        const tasks = await api.get(API_ENDPOINTS.tasks);
        // Filtrar solo las tareas del usuario actual
        allTasks = tasks.filter(task => task.assigneeId === currentUser.id);
        filteredTasks = [...allTasks];
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        ui.showAlert('Error al cargar las tareas', 'error');
    }
}

// Renderizar información del usuario
function renderUserInfo() {
    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');
    const userAvatarEl = document.getElementById('user-avatar');

    if (userNameEl) userNameEl.textContent = currentUser.fullName;
    if (userRoleEl) userRoleEl.textContent = currentUser.role === 'admin' ? 'Admin' : 'Product Designer';
    if (userAvatarEl) userAvatarEl.textContent = ui.getInitials(currentUser.fullName);
}

// Renderizar estadísticas
function renderStats() {
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = allTasks.filter(t => t.status === 'Pending').length;
    const highPriorityTasks = allTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
    // Calcular progreso
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    // Actualizar DOM
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    document.getElementById('overall-progress').textContent = `${progress}%`;
    // Actualizar badge de high priority
    const highPriorityEl = document.getElementById('high-priority-count');
    if (highPriorityEl) {
        highPriorityEl.textContent = highPriorityTasks > 0 ? `${highPriorityTasks} High Priority` : 'All good';
    }
}

// Renderizar tabla de tareas
function renderTasksTable() {
    const tbody = document.getElementById('tasks-tbody');

    if (filteredTasks.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td col span="6" class="text-center" style="padding: 3rem;">
          <div class="empty-state"> <i class="bi bi-inbox"> </i>
            <h3> No hay tareas </h3>
            <p> No se encontraron tareas ${currentFilter !== 'all' ? `con estado "${currentFilter}"` : ''}</p>
          </div>
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = filteredTasks.map(task => `
    <tr>
      <td> <strong>${task.title}</strong> </td>
      <td>
        <div class="assignee-cell">
          <div class="assignee-placeholder">${ui.getInitials(currentUser.fullName)}</div>
          ${currentUser.fullName}
        </div>
      </td>
      <td>
        <span class="status-badge ${ui.getStatusClass(task.status)}">
          ${task.status}
        </span>
      </td>
      <td>
        <span class="priority-badge ${ui.getPriorityClass(task.priority)}">
          <span class="priority-dot"> </span>
          ${task.priority}
        </span>
      </td>
      <td>${ui.formatDate(task.dueDate)}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" onclick="viewTask(${task.id})" title="Ver detalles"> <i class="bi bi-eye"> </i> </button>
          <button class="action-btn edit" onclick="editTask(${task.id})" title="Editar"> <i class="bi bi-pencil"> </i> </button>
          <button class="action-btn delete" onclick="deleteTask(${task.id})" title="Eliminar"> <i class="bi bi-trash"> </i> </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Filtrar tareas
function filterTasks(filter) {
    currentFilter = filter;
    // Actualizar tabs activos
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    // Filtrar
    if (filter === 'all') {
        filteredTasks = [...allTasks];
    } else if (filter === 'Pending') {
        filteredTasks = allTasks.filter(t => t.status === 'Pending');
    } else if (filter === 'Completed') {
        filteredTasks = allTasks.filter(t => t.status === 'Completed');
    }

    renderTasksTable();
}

// Buscar tareas
function searchTasks(query) {
    const searchTerm = query.toLowerCase();

    filteredTasks = allTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.category.toLowerCase().includes(searchTerm)
    );
    // Aplicar filtro actual también
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.status === currentFilter);
    }

    renderTasksTable();
}

// Ver detalles de tarea
function viewTask(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    alert(`Tarea: ${task.title}\n\nDescripción: ${task.description}\nCategoría: ${task.category}\nPrioridad: ${task.priority}\nEstado: ${task.status}\nFecha límite: ${ui.formatDate(task.dueDate)}`);
}

// Editar tarea
function editTask(taskId) {
    window.location = `../index/create-task.html?id=${taskId}`;
}

// Eliminar tarea
async function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        return;
    }

    try {
        await api.delete(API_ENDPOINTS.tasks, taskId);
        ui.showAlert('Tarea eliminada exitosamente', 'success');

        // Recargar tareas
        await loadTasks();
        renderStats();
        renderTasksTable();
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        ui.showAlert('Error al eliminar la tarea', 'error');
    }
}

// Cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        session.destroy();
        window.location = '../index/index.html';
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('search-tasks');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchTasks(e.target.value));
    }
    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', initDashboard);

// Exponer funciones globalmente
window.filterTasks = filterTasks;
window.viewTask = viewTask;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.logout = logout;