import api from './apiClient';

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

export default hrService;
