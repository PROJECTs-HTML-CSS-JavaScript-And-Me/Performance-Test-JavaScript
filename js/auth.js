// auth.js - Manejo de autenticación

// Login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submit-btn');
    const alertContainer = document.getElementById('alert-container');
    // Limpiar alertas previas
    alertContainer.innerHTML = '';
    // Validaciones
    if (!validator.email(email)) {
        showError('Por favor ingresa un email válido');
        return;
    }

    if (!validator.required(password)) {
        showError('Por favor ingresa tu contraseña');
        return;
    }
    // Mostrar loading
    ui.toggleButtonLoading(submitBtn, true);

    try {
        // Obtener todos los usuarios
        const users = await api.get(API_ENDPOINTS.users);
        // Buscar usuario con email y password
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            showError('Email o contraseña incorrectos');
            ui.toggleButtonLoading(submitBtn, false);
            return;
        }
        // Guardar sesión
        session.save(user);
        // Mostrar éxito
        showSuccess('Inicio de sesión exitoso');
        // Redirigir según rol
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location = '../index/admin-dashboard.html';
            } else {
                window.location = '../index/dashboard.html';
            }
        }, 1000);

    } catch (error) {
        console.error('Error en login:', error);
        showError('Error al iniciar sesión. Por favor verifica que el servidor esté corriendo.');
        ui.toggleButtonLoading(submitBtn, false);
    }
}

// Registro
async function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submit-btn');
    const alertContainer = document.getElementById('alert-container');
    // Limpiar alertas previas
    alertContainer.innerHTML = '';
    // Validaciones
    if (!validator.required(fullName)) {
        showError('Por favor ingresa tu nombre completo');
        return;
    }

    if (!validator.email(email)) {
        showError('Por favor ingresa un email válido');
        return;
    }

    if (!validator.minLength(password, 6)) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (!validator.passwordMatch(password, confirmPassword)) {
        showError('Las contraseñas no coinciden');
        return;
    }
    // Mostrar loading
    ui.toggleButtonLoading(submitBtn, true);

    try {
        // Verificar si el email ya existe
        const users = await api.get(API_ENDPOINTS.users);
        const emailExists = users.some(u => u.email === email);

        if (emailExists) {
            showError('Este email ya está registrado');
            ui.toggleButtonLoading(submitBtn, false);
            return;
        }
        // Crear nuevo usuario
        const newUser = {
            fullName,
            email,
            password,
            role: 'user' // Por defecto siempre es user
        };

        const createdUser = await api.post(API_ENDPOINTS.users, newUser);
        // Guardar sesión
        session.save(createdUser);
        // Mostrar éxito
        showSuccess('Registro exitoso. Redirigiendo...');
        // Redirigir a dashboard de usuario
        setTimeout(() => {
            window.location = '../index/dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('Error en registro:', error);
        showError('Error al registrar usuario. Por favor verifica que el servidor esté corriendo.');
        ui.toggleButtonLoading(submitBtn, false);
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget;

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

// Funciones auxiliares
function showError(message) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
    <div class="alert alert-error fade-in"> <i class="bi bi-x-circle-fill"> </i> <span>${message}</span> </div>
  `;
}

function showSuccess(message) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
    <div class="alert alert-success fade-in"> <i class="bi bi-check-circle-fill"> </i> <span>${message}</span> </div>
  `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si ya hay sesión activa y redirigir
    redirectIfAuthenticated();

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});