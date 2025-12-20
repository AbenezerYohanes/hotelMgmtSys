import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Attendance.css';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
      setLoading(true);
      setError(null);
      const employeesRes = await apiService.getEmployees();
      setEmployees(employeesRes.data.employees);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createAttendance(formData);
      setSuccessMessage('Attendance recorded!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setFormData({ employee_id: '', date: new Date().toISOString().split('T')[0], status: 'present' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record attendance');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="attendance-page">
      <h2>Attendance Management</h2>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
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

