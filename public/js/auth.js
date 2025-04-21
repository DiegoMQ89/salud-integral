document.addEventListener('DOMContentLoaded', function() {
    // Configuración de la API
    const API_URL = '/api';
    
    // Elementos del formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Elementos del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Elemento para cerrar sesión
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    // Verificar si el usuario está logueado al cargar la página
    checkAuthStatus();
    
    // Manejar registro
    async function handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showMessage('registerMessage', 'Las contraseñas no coinciden', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al registrar usuario');
            
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'appointments.html';
            
        } catch (error) {
            showMessage('registerMessage', error.message, 'error');
        }
    }
    
    // Manejar login
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');
            
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'appointments.html';
            
        } catch (error) {
            showMessage('loginMessage', error.message, 'error');
        }
    }
    
    // Manejar logout
    function handleLogout(e) {
        e.preventDefault();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    }
    
    if (window.location.pathname.includes('register.html')) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }

    // Verificar estado de autenticación
    function checkAuthStatus() {
        const token = sessionStorage.getItem('token');
        const user  = JSON.parse(sessionStorage.getItem('user'));
    
        // AHORA: solo redirigimos desde login.html, no desde register.html
        if (token && user && window.location.pathname.includes('login.html')) {
            window.location.href = 'appointments.html';
        }
    
        // Si no hay token y estamos en páginas protegidas…
        if (!token && (window.location.pathname.includes('appointments.html')
                    || window.location.pathname.includes('create-appointment.html')
                    || window.location.pathname.includes('success.html'))) {
            window.location.href = 'login.html';
        }
    }
    
    
    // Mostrar mensajes
    function showMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
    }
});
