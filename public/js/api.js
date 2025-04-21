(function() {
    // Base de la API, ahora local al IIFE
    const API_URL = '/api';
  
    // Función para peticiones autenticadas
    async function fetchWithAuth(url, options = {}) {
      const token = sessionStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html';
        return;
      }
  
      const defaultOptions = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        ...options
      };
  
      try {
        const response = await fetch(`${API_URL}${url}`, defaultOptions);
        if (response.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = 'login.html';
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error en la petición');
        return data;
      } catch (error) {
        console.error('Error en fetchWithAuth:', error);
        throw error;
      }
    }
  
    function getCurrentUser() {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  
    function isAdmin() {
      const user = getCurrentUser();
      return user && user.role === 'admin';
    }
  
    // Exponer al scope global lo necesario
    window.fetchWithAuth  = fetchWithAuth;
    window.getCurrentUser = getCurrentUser;
    window.isAdmin        = isAdmin;
  })();
  
