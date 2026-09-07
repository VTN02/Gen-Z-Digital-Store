import axios from 'axios';

/**
 * Centralized Axios instance.
 * All API calls go through this client.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true, // Send httpOnly cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT from localStorage if present (fallback)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored token
      localStorage.removeItem('admin_token');
      // If on admin route, redirect to home
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
