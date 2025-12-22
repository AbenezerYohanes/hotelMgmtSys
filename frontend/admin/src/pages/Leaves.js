import React, { useState, useEffect } from 'react';
import { apiService } from '../utils/apiService';
import './Leaves.css';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await apiService.getLeaves(params);
      setLeaves(res.data.leaves);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load leave requests');
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this leave request?')) return;
    try {
      setError(null);
      await apiService.updateLeave(id, { status: 'approved' });
      setSuccessMessage('Leave approved!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve leave');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this leave request?')) return;
    try {
      setError(null);
      await apiService.updateLeave(id, { status: 'rejected' });
      setSuccessMessage('Leave rejected!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject leave');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leaves-page">
      <div className="page-header">
        <h2>Leave Requests</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {leaves.length === 0 && !loading && <p>No leave requests found</p>}
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.employee?.first_name} {leave.employee?.last_name}</td>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>
              <td>{leave.type}</td>
              <td>
                <span className={`status-badge status-${leave.status}`}>
                  {leave.status}
                </span>
              </td>
              <td>
                {leave.status === 'pending' && (
                  <div className="action-buttons">
                    <button onClick={() => handleApprove(leave.id)} className="btn-approve">
                      Approve
                    </button>
                    <button onClick={() => handleReject(leave.id)} className="btn-reject">
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaves;

