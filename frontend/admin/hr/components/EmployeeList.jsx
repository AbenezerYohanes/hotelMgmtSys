import React, { useEffect, useState } from 'react';

const EmployeeList = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${api}/admin/hr/employees`).then(r => r.json()).then(data => setList(data || [])).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Hotel Employees</h3>
      <ul>
        {list.map(e => <li key={e.id}>{e.User ? e.User.name : e.id}</li>)}
      </ul>
    </div>
  );
};

export default EmployeeList;
