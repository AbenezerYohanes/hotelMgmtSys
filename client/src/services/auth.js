import api from './apiClient';

const normalizeUser = (raw) => {
  if (!raw) return null;
  const userData = raw.data ? raw.data : raw;
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
    try { await api.post('/auth/logout'); } catch (e) {}
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

  changePassword: async ({ current_password, new_password }) => {
    const response = await api.put('/auth/change-password', { current_password, new_password });
    return response.data;
  },
};

export default authService;
