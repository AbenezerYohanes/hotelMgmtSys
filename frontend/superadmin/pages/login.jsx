import React, { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('superadmin@hotel.com');
  const [password, setPassword] = useState('superadmin123');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setMsg('Logged in — token saved to localStorage');
    } catch (err) {
      setMsg('Login failed');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Login (superadmin demo)</h2>
      <form onSubmit={submit}>
        <div><input value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  )
}
