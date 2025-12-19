import { useState, useEffect } from 'react';

export default function useAuth(){
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const u = typeof window !== 'undefined' && localStorage.getItem('reception_user');
    if (u) setUser(JSON.parse(u));
  },[]);
  return { user };
}
