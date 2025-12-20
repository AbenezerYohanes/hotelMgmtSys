import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const apiService = {
  // Auth
  login: (email, password) => api.post('/auth/login', { email, password }),
  guestRegister: (data) => api.post('/auth/guest/register', data),
  guestLogin: (email, password) => api.post('/auth/guest/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),

  // Employees
  getEmployees: () => api.get('/employees'),
  getEmployee: (id) => api.get(`/employees/${id}`),
  createEmployee: (data) => api.post('/employees', data),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  getMyProfile: () => api.get('/employees/me/profile'),
  getMyAttendance: () => api.get('/employees/me/attendance'),
  getMyLeaves: () => api.get('/employees/me/leaves'),
  getMyPayroll: () => api.get('/employees/me/payroll'),
  getMyReviews: () => api.get('/employees/me/reviews'),

  // Guests
  getGuests: () => api.get('/guests'),
  getGuest: (id) => api.get(`/guests/${id}`),
  updateGuest: (id, data) => api.put(`/guests/${id}`, data),
  deleteGuest: (id) => api.delete(`/guests/${id}`),
  getMyGuestProfile: () => api.get('/guests/me/profile'),
  updateMyGuestProfile: (data) => api.put('/guests/me/profile', data),
  getMyReservations: () => api.get('/guests/me/reservations'),
  getMyBillings: () => api.get('/guests/me/billings'),

  // Rooms
  getRooms: (params) => api.get('/rooms', { params }),
  getRoom: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  checkAvailableRooms: (params) => api.get('/rooms/available/check', { params }),

  // Reservations
  getReservations: (params) => api.get('/reservations', { params }),
  getReservation: (id) => api.get(`/reservations/${id}`),
  createReservation: (data) => api.post('/reservations', data),
  updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
  cancelReservation: (id) => api.put(`/reservations/${id}/cancel`),
  checkIn: (id) => api.put(`/reservations/${id}/checkin`),
  checkOut: (id) => api.put(`/reservations/${id}/checkout`),
  getMyReservations: () => api.get('/reservations/me/list'),

  // Billing
  getBillings: (params) => api.get('/billing', { params }),
  getBilling: (id) => api.get(`/billing/${id}`),
  createBilling: (data) => api.post('/billing', data),
  updateBilling: (id, data) => api.put(`/billing/${id}`, data),
  processPayment: (id, data) => api.put(`/billing/${id}/pay`, data),
  getMyBillings: () => api.get('/billing/me/list'),

  // Documents
  getDocuments: (params) => api.get('/documents', { params }),
  getDocument: (id) => api.get(`/documents/${id}`),
  uploadDocument: (data) => api.post('/documents', data),
  verifyDocument: (id, status) => api.put(`/documents/${id}/verify`, { status }),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  getMyDocuments: () => api.get('/documents/me/list'),

  // Admin HR
  getHRDashboard: () => api.get('/admin/hr/dashboard'),
  createAttendance: (data) => api.post('/admin/hr/attendance', data),
  getLeaves: (params) => api.get('/admin/hr/leaves', { params }),
  updateLeave: (id, data) => api.put(`/admin/hr/leaves/${id}`, data),
  createPayroll: (data) => api.post('/admin/hr/payroll', data),
  getPayrolls: (params) => api.get('/admin/hr/payroll', { params }),
  createReview: (data) => api.post('/admin/hr/reviews', data),
  getReviews: (params) => api.get('/admin/hr/reviews', { params }),
  getDepartments: () => api.get('/admin/hr/departments'),
  createDepartment: (data) => api.post('/admin/hr/departments', data),

  // Receptionist
  getReceptionistDashboard: () => api.get('/receptionists/dashboard'),
  quickCheckIn: (data) => api.post('/receptionists/checkin', data),
  quickCheckOut: (data) => api.post('/receptionists/checkout', data),

  // SuperAdmin
  getHotels: () => api.get('/superadmin/hotels'),
  createHotel: (data) => api.post('/superadmin/hotels', data),
  updateHotel: (id, data) => api.put(`/superadmin/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/superadmin/hotels/${id}`),
  getRoles: () => api.get('/superadmin/roles'),
  createRole: (data) => api.post('/superadmin/roles', data),
  updateRole: (id, data) => api.put(`/superadmin/roles/${id}`, data),
  getAnalytics: () => api.get('/superadmin/analytics'),
};

export default api;

