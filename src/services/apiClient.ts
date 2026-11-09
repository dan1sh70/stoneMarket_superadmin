import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('superadmin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified data unpack and 401 redirect
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if already on login page or viewing public pages
      const pathname = window.location.pathname;
      const isPublicPath = pathname.includes('/login') || 
                           pathname.startsWith('/pages/') || 
                           pathname.startsWith('/p/') ||
                           pathname === '/delete-account' ||
                           pathname === '/delete-my-account';
      if (!isPublicPath) {
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('superadmin_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

