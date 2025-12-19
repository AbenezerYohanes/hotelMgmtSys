import axios from 'axios';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api/receptionist' });

API.interceptors.request.use(cfg => {
  const token = typeof window !== 'undefined' && localStorage.getItem('reception_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export async function get(path){
  const res = await API.get(path);
  return res.data;
}
export async function post(path, data){
  const res = await API.post(path, data);
  return res.data;
}
export default API;
