import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
const normalizeUser = (raw) => {
  if (!raw) return null;
  const userData = raw.data ? raw.data : raw; // some endpoints wrap data
  return {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role,
    phone: userData.phone,
    address: userData.address,
    createdAt: userData.created_at,
  };
};

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const payload = response.data;
    const token = payload?.data?.token || payload?.token;
    const user = normalizeUser(payload?.data?.user || payload?.user);
    return { token, user };
  },

  register: async (registrationData) => {
    const response = await api.post('/auth/register', registrationData);
    const payload = response.data;
    const token = payload?.data?.token || payload?.token;
    const user = normalizeUser(payload?.data?.user || payload?.user);
    return { token, user };
  },

  logout: async () => {
    // server may not have explicit logout; clear client state regardless
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    return { success: true };
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return normalizeUser(response.data);
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return normalizeUser(response.data);
  },
};

// Users service
export const usersService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Bookings service
export const bookingsService = {
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

// Rooms service
export const roomsService = {
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getRoom: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};

// Guests service
export const guestsService = {
  getGuests: async () => {
    const response = await api.get('/guests');
    return response.data;
  },

  getGuest: async (id) => {
    const response = await api.get(`/guests/${id}`);
    return response.data;
  },

  createGuest: async (guestData) => {
    const response = await api.post('/guests', guestData);
    return response.data;
  },

  updateGuest: async (id, guestData) => {
    const response = await api.put(`/guests/${id}`, guestData);
    return response.data;
  },

  deleteGuest: async (id) => {
    const response = await api.delete(`/guests/${id}`);
    return response.data;
  },
};

// HR service
export const hrService = {
  getEmployees: async () => {
    const response = await api.get('/hr/employees');
    return response.data;
  },

  getEmployee: async (id) => {
    const response = await api.get(`/hr/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await api.post('/hr/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/hr/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/hr/employees/${id}`);
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('/hr/departments');
    return response.data;
  },
};

// Payments service
export const paymentsService = {
  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  getPayment: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  updatePayment: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

// Reports service
export const reportsService = {
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getBookingStats: async (period) => {
    const response = await api.get(`/reports/bookings?period=${period}`);
    return response.data;
  },

  getRevenueStats: async (period) => {
    const response = await api.get(`/reports/revenue?period=${period}`);
    return response.data;
  },

  getOccupancyStats: async (period) => {
    const response = await api.get(`/reports/occupancy?period=${period}`);
    return response.data;
  },
};

export default api;
