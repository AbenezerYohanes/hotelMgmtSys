import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Functions for Guest Portal
export const apiService = {
  // Auth
  guestRegister: (data) => api.post('/auth/guest/register', data),
  guestLogin: (email, password) => api.post('/auth/guest/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),

  // Guests
  getMyGuestProfile: () => api.get('/guests/me/profile'),
  updateMyGuestProfile: (data) => api.put('/guests/me/profile', data),
  getMyReservations: () => api.get('/guests/me/reservations'),
  getMyBillings: () => api.get('/guests/me/billings'),

  // Rooms
  getRooms: (params) => api.get('/rooms', { params }),
  getRoom: (id) => api.get(`/rooms/${id}`),
  checkAvailableRooms: (params) => api.get('/rooms/available/check', { params }),

  // Reservations
  createReservation: (data) => api.post('/reservations', data),
  cancelReservation: (id) => api.put(`/reservations/${id}/cancel`),
  getMyReservations: () => api.get('/reservations/me/list'),

  // Billing
  getMyBillings: () => api.get('/billing/me/list'),
};

export default api;

