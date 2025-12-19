import API from './api';

export async function login({ email, password }){
  const res = await API.post('/auth/login', { email, password });
  if (res.data && res.data.token) {
    localStorage.setItem('reception_token', res.data.token);
    localStorage.setItem('reception_user', JSON.stringify(res.data.user));
  }
  return res.data || res;
}

export function logout(){
  localStorage.removeItem('reception_token');
  localStorage.removeItem('reception_user');
}
