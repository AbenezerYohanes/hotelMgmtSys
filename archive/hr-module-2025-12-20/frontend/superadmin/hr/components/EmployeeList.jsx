import React, { useEffect, useState } from 'react';

const EmployeeList = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${api}/superadmin/hr/employees`).then(r => r.json()).then(data => setList(data || [])).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Employees</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd' }}>ID</th>
            <th style={{ border: '1px solid #ddd' }}>Name</th>
            <th style={{ border: '1px solid #ddd' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {list.map(e => (
            <tr key={e.id}>
              <td style={{ border: '1px solid #eee' }}>{e.id}</td>
              <td style={{ border: '1px solid #eee' }}>{e.User ? e.User.name : '-'}</td>
              <td style={{ border: '1px solid #eee' }}>{e.User ? e.User.email : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;