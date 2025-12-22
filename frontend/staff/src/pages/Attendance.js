import React, { useState, useEffect } from 'react';
import { apiService } from '../common/utils/apiService';
import './Attendance.css';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getMyAttendance();
      setAttendance(res.data.attendance);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load attendance');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setError(null);
      await apiService.clockIn();
      setSuccessMessage('Clocked in successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clock in');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleClockOut = async () => {
    try {
      setError(null);
      await apiService.clockOut();
      setSuccessMessage('Clocked out successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clock out');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="attendance-page">
      <h2>My Attendance</h2>
      {error && <div className="error-banner">{error}</div>}
      {attendance.length === 0 && !loading && <p>No attendance records found</p>}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.clock_in ? new Date(record.clock_in).toLocaleString() : 'N/A'}</td>
              <td>{record.clock_out ? new Date(record.clock_out).toLocaleString() : 'N/A'}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;

