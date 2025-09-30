const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    return data;
  },

  async register(email, password, confirmPassword) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }
    
    return data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return await response.json();
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuario');
    }
    
    return data;
  }
};