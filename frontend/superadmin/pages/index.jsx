import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  useEffect(() => {
    axios.get((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/health')
      .then(r => setHealth(r.data)).catch(() => setHealth({ ok: false }));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Superadmin Dashboard</h1>
      <p>System health: {health ? JSON.stringify(health) : 'loading...'}</p>
      <p>This is a minimal dashboard placeholder. Expand components in `/frontend/common`.</p>
    </div>
  )
}
