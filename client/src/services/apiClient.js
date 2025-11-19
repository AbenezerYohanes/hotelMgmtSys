import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('[api] Network error or no response received:', error.message);
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    console.error('[api] Response error:', {
      url: error.config?.url,
      status: error.response.status,
      data: error.response.data,
    });
    return Promise.reject(error);
  }
);

export default api;
