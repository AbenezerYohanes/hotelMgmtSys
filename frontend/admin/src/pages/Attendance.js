import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Attendance.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesRes] = await Promise.all([
        axios.get(`${API_URL}/employees`)
      ]);
      setEmployees(employeesRes.data.employees);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/hr/attendance`, formData);
      alert('Attendance recorded!');
      setFormData({ employee_id: '', date: new Date().toISOString().split('T')[0], status: 'present' });
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="attendance-page">
      <h2>Attendance Management</h2>
      <form onSubmit={handleSubmit} className="attendance-form">
        <select
          value={formData.employee_id}
          onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="on_leave">On Leave</option>
        </select>
        <button type="submit">Record Attendance</button>
      </form>
    </div>
  );
};

export default Attendance;

