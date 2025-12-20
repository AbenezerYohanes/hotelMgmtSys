import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${api}/superadmin/hr/employees`).then(r => r.json()).then(data => {
      setStats({ total: Array.isArray(data) ? data.length : 0 });
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>HR Dashboard</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Total employees</strong>
          <div>{stats ? stats.total : '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
