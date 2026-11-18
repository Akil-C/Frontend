import axios from 'axios';

// Normalize API_BASE_URL: automatically append /api if user specified root domain without it
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-1-snun.onrender.com/api';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout to allow Render free tier cold-start wakeups (takes 30-50s)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — inject JWT token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Never send Authorization header for login, register, or refresh endpoints
    if (!config.url?.includes('/auth/')) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the request was to an auth endpoint (login, register, refresh), do not try to refresh or redirect
    if (originalRequest?.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (_err) {
          // Refresh failed — clear invalid tokens without hijacking user's current page
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
