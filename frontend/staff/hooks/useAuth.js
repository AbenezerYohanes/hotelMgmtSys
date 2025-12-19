import { createContext, useContext, useState, useEffect, useRef } from 'react'
import Api from '../services/api'

const AuthContext = createContext(null)

function decodeJwt(token){
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch(e){ return null }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('staff_token') : null);
  const [user, setUser] = useState(null);
  const logoutTimer = useRef(null);

  useEffect(()=>{
    if (token) {
      Api.setToken(token);
      const p = decodeJwt(token);
      if (p && p.exp) {
        const ttl = p.exp * 1000 - Date.now();
        if (ttl <= 0) {
          doLogout();
          return;
        }
        clearTimeout(logoutTimer.current);
        logoutTimer.current = setTimeout(() => doLogout(), ttl + 1000);
      }
      fetchUser();
    } else {
      Api.setToken(null);
      setUser(null);
    }
    return () => clearTimeout(logoutTimer.current);
  }, [token]);

  const fetchUser = async () => {
    try { const u = await Api.get('/profile'); setUser(u); } catch(e){ console.error('fetchUser', e); }
  };

  const login = async (email, password) => {
    const res = await Api.rawPost('/auth/login', { email, password });
    if (!res || !res.token) throw new Error('Invalid login response');
    setToken(res.token);
    localStorage.setItem('staff_token', res.token);
    Api.setToken(res.token);
    setUser(res.user || null);
  };

  const doLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('staff_token');
    Api.setToken(null);
    if (typeof window !== 'undefined') window.location.href = '/login';
  };

  const logout = () => doLogout();

  const refreshUser = async () => fetchUser();

  const context = { token, user, login, logout, refreshUser, api: Api }
  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export default function useAuth(){ return useContext(AuthContext); }
