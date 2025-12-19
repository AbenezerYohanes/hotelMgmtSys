import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminDashboard(){
  const [stats, setStats] = useState(null);
  useEffect(()=>{
    axios.get((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/reports/occupancy', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(r=>setStats(r.data)).catch(()=>setStats({}));
  },[])
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <pre>{JSON.stringify(stats,null,2)}</pre>
    </div>
  )
}
