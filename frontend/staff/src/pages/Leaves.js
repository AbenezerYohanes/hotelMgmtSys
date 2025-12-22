import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Leaves.css';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    type: 'annual',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getMyLeaves();
      setLeaves(res.data.leaves);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load leave requests');
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createLeave(formData);
      setSuccessMessage('Leave request submitted!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateModal(false);
      setFormData({ start_date: '', end_date: '', type: 'annual', reason: '' });
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leaves-page">
      <div className="page-header">
        <h2>My Leave Requests</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Request Leave
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Request Leave">
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            placeholder="Start Date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="End Date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="annual">Annual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Leave</option>
          </select>
          <textarea
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows="4"
          />
          <button type="submit">Submit Request</button>
        </form>
      </Modal>
      {leaves.length === 0 && !loading && <p>No leave requests found</p>}
      <table>
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>
              <td>{leave.type}</td>
              <td>{leave.status}</td>
              <td>{leave.reason || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaves;

