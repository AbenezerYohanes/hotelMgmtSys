import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    getEmployees: () => api.get('/employees'),
    createEmployee: (data) => api.post('/employees', data),
    getDepartments: () => api.get('/departments'),
    createDepartment: (data) => api.post('/departments', data),
    getAttendance: () => api.get('/attendance'),
    createAttendance: (data) => api.post('/attendance', data),
    getHRDashboard: () => api.get('/dashboard/hr'),
    getLeaves: (params) => api.get('/leaves', { params }),
    updateLeave: (id, data) => api.put(`/leaves/${id}`, data),
    getPayroll: () => api.get('/payroll'),
    getReviews: () => api.get('/reviews'),
    getRooms: () => api.get('/rooms'),
    getHotels: () => api.get('/hotels'),
    createHotel: (data) => api.post('/hotels', data),
    getRoles: () => api.get('/roles'),
    createRole: (data) => api.post('/roles', data),
};
