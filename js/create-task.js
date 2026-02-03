// create-task.js - Crear y editar tareas

let currentUser = null;
let isEditMode = false;
let taskId = null;
let allUsers = [];

// Inicializar página
async function initTaskForm() {
    // Verificar autenticación
    if (!checkAuth()) return;
    // Obtener usuario actual
    currentUser = session.get();
    // Verificar si es modo edición
    const urlParams = new URLSearchParams(window.location.search);
    taskId = urlParams.get('id');
    isEditMode = taskId !== null;
    // Renderizar info de usuario
    renderUserInfo();
    // Si es admin, cargar usuarios para asignar
    if (currentUser.role === 'admin') {
        await loadUsers();
        showAssigneeField();
    }
    // Si es modo edición, cargar la tarea
    if (isEditMode) {
        await loadTask();
    }
    // Configurar event listeners
    setupEventListeners();
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

// Cargar usuarios (solo para admin)
async function loadUsers() {
    try {
        allUsers = await api.get(API_ENDPOINTS.users);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Mostrar campo de asignación (solo para admin)
function showAssigneeField() {
    const assigneeGroup = document.getElementById('assignee-group');
    if (!assigneeGroup) return;

    assigneeGroup.classList.remove('d-none');

    const assigneeSelect = document.getElementById('assignee');
    assigneeSelect.innerHTML = `
    <option value=""> Seleccionar usuario... </option>
    ${allUsers.map(user => `
      <option value="${user.id}">${user.fullName} (${user.email})</option>
    `).join('')}
  `;
}

// Cargar tarea para editar
async function loadTask() {
    try {
        const task = await api.get(API_ENDPOINTS.tasks, taskId);
        // Verificar permisos
        if (currentUser.role !== 'admin' && task.assigneeId !== currentUser.id) {
            alert('No tienes permisos para editar esta tarea');
            window.history.back();
            return;
        }
        // Llenar formulario
        document.getElementById('title').value = task.title;
        document.getElementById('category').value = task.category;
        document.getElementById('priority').value = task.priority;
        document.getElementById('status').value = task.status;
        document.getElementById('dueDate').value = task.dueDate;
        document.getElementById('description').value = task.description;

        if (currentUser.role === 'admin') {
            document.getElementById('assignee').value = task.assigneeId;
        }
        // Actualizar título de página
        document.querySelector('.page-title').textContent = 'Editar Tarea';
        document.getElementById('submit-btn').textContent = 'Actualizar Tarea';

    } catch (error) {
        console.error('Error al cargar tarea:', error);
        alert('Error al cargar la tarea');
        window.history.back();
    }
}

// Manejar envío del formulario
async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    // Obtener valores
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    const dueDate = document.getElementById('dueDate').value;
    const description = document.getElementById('description').value.trim();
    // Validaciones
    if (!title) {
        alert('Por favor ingresa un título para la tarea');
        return;
    }

    if (!category) {
        alert('Por favor selecciona una categoría');
        return;
    }

    if (!dueDate) {
        alert('Por favor selecciona una fecha límite');
        return;
    }
    // Preparar datos de tarea
    const taskData = {
        title,
        category,
        priority,
        status,
        dueDate,
        description: description || ''
    };
    // Si es admin, incluir assigneeId
    if (currentUser.role === 'admin') {
        const assigneeId = parseInt(document.getElementById('assignee').value);
        if (!assigneeId) {
            alert('Por favor selecciona un usuario asignado');
            return;
        }
        taskData.assigneeId = assigneeId;
        taskData.createdBy = currentUser.id;
    } else {
        // Si es usuario, asignar a sí mismo
        taskData.assigneeId = currentUser.id;
        taskData.createdBy = currentUser.id;
    }
    // Mostrar loading
    ui.toggleButtonLoading(submitBtn, true);

    try {
        if (isEditMode) {
            // Actualizar tarea existente
            await api.put(API_ENDPOINTS.tasks, taskId, taskData);
            alert('Tarea actualizada exitosamente');
        } else {
            // Crear nueva tarea
            await api.post(API_ENDPOINTS.tasks, taskData);
            alert('Tarea creada exitosamente');
        }
        // Redirigir según rol
        if (currentUser.role === 'admin') {
            window.location = '../index/admin-dashboard.html';
        } else {
            window.location = '../index/dashboard.html';
        }

    } catch (error) {
        console.error('Error al guardar tarea:', error);
        alert('Error al guardar la tarea');
        ui.toggleButtonLoading(submitBtn, false);
    }
}

// Cancelar y volver
function handleCancel() {
    if (confirm('¿Estás seguro? Los cambios no guardados se perderán.')) {
        window.history.back();
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
    const form = document.getElementById('task-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', initTaskForm);

// Exponer funciones globalmente
window.logout = logout;