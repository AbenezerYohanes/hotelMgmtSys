import { useState } from 'react'
import { useRouter } from 'next/router'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('staff@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="container">
      <h2>Staff Login</h2>
      <form onSubmit={submit} className="card">
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
