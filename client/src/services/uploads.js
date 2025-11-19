import api from './apiClient';

export const uploadsService = {
  uploadStaffDocument: async (employeeId, file) => {
    const fd = new FormData();
    fd.append('file', file);
    const response = await api.post(`/uploads/staff/${employeeId}/document`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadBookingInvoice: async (bookingId, file) => {
    const fd = new FormData();
    fd.append('file', file);
    const response = await api.post(`/uploads/bookings/${bookingId}/invoice`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getStaffDocuments: async (employeeId) => {
    const response = await api.get(`/uploads/staff/${employeeId}/documents`);
    return response.data;
  },

  deleteStaffDocument: async (documentId) => {
    const response = await api.delete(`/uploads/staff/documents/${documentId}`);
    return response.data;
  },
};

export default uploadsService;
