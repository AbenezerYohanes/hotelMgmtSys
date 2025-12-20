import React from 'react';
import Dashboard from '../../hr/components/Dashboard';
import EmployeeList from '../../hr/components/EmployeeList';

const HRPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Superadmin HR</h1>
      <Dashboard />
      <EmployeeList />
    </div>
  );
};

export default HRPage;
