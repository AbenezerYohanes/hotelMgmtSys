import React, { useState, useEffect } from 'react';
import { apiService } from 'frontend-common/utils/apiService';
import Modal from '../components/Modal';
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
      <div className="page-header">
        <h2>Attendance Management</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Mark Attendance
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Mark Attendance">
        <form onSubmit={handleSubmit}>
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
          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Record Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;

