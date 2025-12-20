import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Employees.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data.employees);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="employees-page">
      <h2>All Employees (Global View)</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Hotel</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.first_name} {employee.last_name}</td>
              <td>{employee.email}</td>
              <td>{employee.role?.name || 'N/A'}</td>
              <td>{employee.hotel?.name || 'N/A'}</td>
              <td>
                <span className={`status-badge status-${employee.status}`}>
                  {employee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;

