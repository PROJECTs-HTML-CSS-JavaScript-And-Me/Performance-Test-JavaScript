// profile.js - Gestión de perfil de usuario

let currentUser = null;

// Inicializar página de perfil
async function initProfile() {
    // Verificar autenticación
    if (!checkAuth()) return;
    // Obtener usuario actual
    currentUser = session.get();
    // Renderizar información
    renderUserInfo();
    renderProfileData();
    // Configurar event listeners
    setupEventListeners();
}

// Renderizar info en header
function renderUserInfo() {
    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');
    const userAvatarEl = document.getElementById('user-avatar');

    if (userNameEl) userNameEl.textContent = currentUser.fullName;
    if (userRoleEl) userRoleEl.textContent = currentUser.role === 'admin' ? 'Admin' : 'Product Designer';
    if (userAvatarEl) userAvatarEl.textContent = ui.getInitials(currentUser.fullName);
}

// Renderizar datos del perfil
function renderProfileData() {
    // Avatar grande
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) {
        profileAvatar.textContent = ui.getInitials(currentUser.fullName);
    }
    // Información básica
    document.getElementById('profile-name').textContent = currentUser.fullName;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-role').textContent = currentUser.role === 'admin' ? 'Administrador' : 'Usuario';
    document.getElementById('profile-id').textContent = `#${currentUser.id}`;
    // Llenar formulario de edición
    document.getElementById('edit-fullName').value = currentUser.fullName;
    document.getElementById('edit-email').value = currentUser.email;
}

// Alternar modo de edición
function toggleEditMode() {
    const viewMode = document.getElementById('profile-view');
    const editMode = document.getElementById('profile-edit');

    viewMode.classList.toggle('d-none');
    editMode.classList.toggle('d-none');
}

// Guardar cambios del perfil
async function saveProfile(event) {
    event.preventDefault();

    const fullName = document.getElementById('edit-fullName').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const currentPassword = document.getElementById('edit-currentPassword').value;
    const newPassword = document.getElementById('edit-newPassword').value;
    const confirmPassword = document.getElementById('edit-confirmPassword').value;
    const submitBtn = document.getElementById('save-btn');

    // Validaciones
    if (!fullName) {
        alert('Por favor ingresa tu nombre completo');
        return;
    }

    if (!validator.email(email)) {
        alert('Por favor ingresa un email válido');
        return;
    }

    // Si está cambiando contraseña
    if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
            alert('Por favor ingresa tu contraseña actual');
            return;
        }

        if (currentPassword !== currentUser.password) {
            alert('La contraseña actual es incorrecta');
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            alert('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Las contraseñas nuevas no coinciden');
            return;
        }
    }
    // Preparar datos actualizados
    const updatedData = {
        ...currentUser,
        fullName,
        email
    };
    // Si hay nueva contraseña, actualizarla
    if (newPassword) {
        updatedData.password = newPassword;
    }
    // Mostrar loading
    ui.toggleButtonLoading(submitBtn, true);

    try {
        // Verificar si el email ya existe (solo si cambió)
        if (email !== currentUser.email) {
            const users = await api.get(API_ENDPOINTS.users);
            const emailExists = users.some(u => u.email === email && u.id !== currentUser.id);

            if (emailExists) {
                alert('Este email ya está siendo usado por otro usuario');
                ui.toggleButtonLoading(submitBtn, false);
                return;
            }
        }
        // Actualizar usuario
        const updated = await api.put(API_ENDPOINTS.users, currentUser.id, updatedData);
        // Actualizar sesión
        session.save(updated);
        currentUser = updated;

        alert('Perfil actualizado exitosamente');
        // Volver a vista de perfil
        toggleEditMode();
        renderProfileData();
        // Limpiar campos de contraseña
        document.getElementById('edit-currentPassword').value = '';
        document.getElementById('edit-newPassword').value = '';
        document.getElementById('edit-confirmPassword').value = '';

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        alert('Error al actualizar el perfil');
    } finally {
        ui.toggleButtonLoading(submitBtn, false);
    }
}

// Cancelar edición
function cancelEdit() {
    toggleEditMode();
    // Restaurar valores originales
    document.getElementById('edit-fullName').value = currentUser.fullName;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-currentPassword').value = '';
    document.getElementById('edit-newPassword').value = '';
    document.getElementById('edit-confirmPassword').value = '';
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
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', toggleEditMode);
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfile);
    }

    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', initProfile);

// Exponer funciones globalmente
window.logout = logout;