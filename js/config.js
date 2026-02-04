// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

// Endpoints
const API_ENDPOINTS = {
    users: `${API_BASE_URL}/users`,
    tasks: `${API_BASE_URL}/tasks`
};

// Utilidades de API
const api = {
    // GET request
    async get(endpoint, id = null) {
        try {
            const url = id ? `${endpoint}/${id}` : endpoint;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en GET:', error);
            throw error;
        }
    },

    // POST request
    async post(endpoint, data) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en POST:', error);
            throw error;
        }
    },

    // PUT request
    async put(endpoint, id, data) {
        try {
            const response = await fetch(`${endpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en PUT:', error);
            throw error;
        }
    },

    // PATCH request
    async patch(endpoint, id, data) {
        try {
            const response = await fetch(`${endpoint}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en PATCH:', error);
            throw error;
        }
    },

    // DELETE request
    async delete(endpoint, id) {
        try {
            const response = await fetch(`${endpoint}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en DELETE:', error);
            throw error;
        }
    }
};

// Gestión de sesión
const session = {
    // Guardar sesión
    save(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },
    // Obtener sesión
    get() {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    // Verificar si hay sesión
    exists() {
        return sessionStorage.getItem('currentUser') !== null;
    },
    // Cerrar sesión
    destroy() {
        sessionStorage.removeItem('currentUser');
    },
    // Verificar rol
    isAdmin() {
        const user = this.get();
        return user && user.role === 'admin';
    },

    isUser() {
        const user = this.get();
        return user && user.role === 'user';
    }
};

// Protección de rutas
function checkAuth() {
    if (!session.exists()) {
        window.location = '../index/index.html';
        return false;
    }
    return true;
}

function checkAdminAuth() {
    if (!session.exists()) {
        window.location = '../index/index.html';
        return false;
    }

    if (!session.isAdmin()) {
        window.location = '../index/dashboard.html';
        return false;
    }

    return true;
}

function checkUserAuth() {
    if (!session.exists()) {
        window.location = '../index/index.html';
        return false;
    }

    if (!session.isUser()) {
        window.location = '../index/admin-dashboard.html';
        return false;
    }

    return true;
}

/* Redireccionar si ya hay sesión */
function redirectIfAuthenticated() {
    if (session.exists()) { 
        window.location = '../index/admin-dashboard.html';
    }
} 

// Utilidades de UI
const ui = {
    // Mostrar alerta
    showAlert(message, type = 'info', duration = 3000) {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fade-in`;
        alert.innerHTML = `
      <i class="bi bi-${this.getAlertIcon(type)}"> </i>
      <span>${message}</span>
    `;

        alertContainer.appendChild(alert);

        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, duration);
    },

    getAlertIcon(type) {
        const icons = {
            success: 'check-circle-fill',
            error: 'x-circle-fill',
            warning: 'exclamation-triangle-fill',
            info: 'info-circle-fill'
        };
        return icons[type] || icons.info;
    },

    // Mostrar/ocultar spinner en botón
    toggleButtonLoading(button, loading = true) {
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner"> </span> Cargando...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText;
        }
    },

    // Formatear fecha
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    },

    // Obtener iniciales
    getInitials(name) {
        if (!name) return '??';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },

    // Obtener clase de prioridad
    getPriorityClass(priority) {
        const classes = {
            'High': 'priority-high',
            'Medium': 'priority-medium',
            'Low': 'priority-low'
        };
        return classes[priority] || '';
    },

    // Obtener clase de estado
    getStatusClass(status) {
        const normalized = status.toLowerCase().replace(/\s+/g, '-');
        return `status-${normalized}`;
    }
};

// Validación de formularios
const validator = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    required(value) {
        return value && value.trim().length > 0;
    },

    minLength(value, length) {
        return value && value.length >= length;
    },

    passwordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }
};

// Exportar para uso global
window.API_ENDPOINTS = API_ENDPOINTS;
window.api = api;
window.session = session;
window.ui = ui;
window.validator = validator;
window.checkAuth = checkAuth;
window.checkAdminAuth = checkAdminAuth;
window.checkUserAuth = checkUserAuth;
window.redirectIfAuthenticated = redirectIfAuthenticated;