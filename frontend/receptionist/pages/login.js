import { useState } from 'react';
import Router from 'next/router';
import { login } from '../../services/authService';

export default function Login() {
  const [email, setEmail] = useState('reception@hotel.test');
  const [password, setPassword] = useState('password123');
  const [err, setErr] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await login({ email, password });
      if (res.success) Router.push('/dashboard');
    } catch (e) { setErr(e.message || 'Login failed'); }
  };

  return (
    <div style={{maxWidth:400, margin:'40px auto'}}>
      <h2>Receptionist Login</h2>
      <form onSubmit={handle}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        {err && <div style={{color:'red'}}>{err}</div>}
      </form>
    </div>
  );
}
