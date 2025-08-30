import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation errors
          if (data && typeof data === 'object' && 'details' in data) {
            const details = (data as any).details;
            if (Array.isArray(details)) {
              details.forEach((detail: any) => {
                toast.error(detail.message || 'Validation error');
              });
            } else {
              toast.error('Validation error');
            }
          } else {
            toast.error('Invalid data provided.');
          }
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Internal server error. Please try again later.');
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  users: '/users',
  rooms: '/rooms',
  bookings: '/bookings',
  guests: '/guests',
  hr: '/hr',
  payments: '/payments',
  reports: '/reports',
  chapa: '/chapa',
};

// Generic API functions
export const apiService = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await api.get(url, { params });
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post(url, data);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put(url, data);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.patch(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete(url);
    return response.data;
  },

  // File upload
  upload: async <T>(url: string, formData: FormData): Promise<T> => {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Auth service
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    return apiService.post(endpoints.auth.login, credentials);
  },

  register: async (userData: any) => {
    return apiService.post(endpoints.auth.register, userData);
  },

  getProfile: async () => {
    return apiService.get(endpoints.auth.profile);
  },

  updateProfile: async (profileData: any) => {
    return apiService.put(endpoints.auth.profile, profileData);
  },

  logout: async () => {
    try {
      await apiService.post(endpoints.auth.logout);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

// Room service
export const roomService = {
  getAll: async (params?: any) => {
    return apiService.get(endpoints.rooms, params);
  },

  getById: async (id: string) => {
    return apiService.get(`${endpoints.rooms}/${id}`);
  },

  create: async (roomData: any) => {
    return apiService.post(endpoints.rooms, roomData);
  },

  update: async (id: string, roomData: any) => {
    return apiService.put(`${endpoints.rooms}/${id}`, roomData);
  },

  delete: async (id: string) => {
    return apiService.delete(`${endpoints.rooms}/${id}`);
  },
};

// Booking service
export const bookingService = {
  getAll: async (params?: any) => {
    return apiService.get(endpoints.bookings, params);
  },

  getById: async (id: string) => {
    return apiService.get(`${endpoints.bookings}/${id}`);
  },

  create: async (bookingData: any) => {
    return apiService.post(endpoints.bookings, bookingData);
  },

  update: async (id: string, bookingData: any) => {
    return apiService.put(`${endpoints.bookings}/${id}`, bookingData);
  },

  delete: async (id: string) => {
    return apiService.delete(`${endpoints.bookings}/${id}`);
  },

  cancel: async (id: string) => {
    return apiService.patch(`${endpoints.bookings}/${id}/cancel`);
  },
};

// Guest service
export const guestService = {
  getAll: async (params?: any) => {
    return apiService.get(endpoints.guests, params);
  },

  getById: async (id: string) => {
    return apiService.get(`${endpoints.guests}/${id}`);
  },

  create: async (guestData: any) => {
    return apiService.post(endpoints.guests, guestData);
  },

  update: async (id: string, guestData: any) => {
    return apiService.put(`${endpoints.guests}/${id}`, guestData);
  },

  delete: async (id: string) => {
    return apiService.delete(`${endpoints.guests}/${id}`);
  },
};

// Payment service
export const paymentService = {
  getAll: async (params?: any) => {
    return apiService.get(endpoints.payments, params);
  },

  getById: async (id: string) => {
    return apiService.get(`${endpoints.payments}/${id}`);
  },

  create: async (paymentData: any) => {
    return apiService.post(endpoints.payments, paymentData);
  },

  update: async (id: string, paymentData: any) => {
    return apiService.put(`${endpoints.payments}/${id}`, paymentData);
  },

  delete: async (id: string) => {
    return apiService.delete(`${endpoints.payments}/${id}`);
  },
};

// Report service
export const reportService = {
  getDashboardStats: async () => {
    return apiService.get(`${endpoints.reports}/dashboard`);
  },

  getBookingReport: async (params?: any) => {
    return apiService.get(`${endpoints.reports}/bookings`, params);
  },

  getRevenueReport: async (params?: any) => {
    return apiService.get(`${endpoints.reports}/revenue`, params);
  },

  getOccupancyReport: async (params?: any) => {
    return apiService.get(`${endpoints.reports}/occupancy`, params);
  },
};

export default api; 