import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaves.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await axios.get(`${API_URL}/admin/hr/leaves`, { params });
      setLeaves(res.data.leaves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/hr/leaves/${id}`, { status: 'approved' });
      alert('Leave approved!');
      fetchLeaves();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/hr/leaves/${id}`, { status: 'rejected' });
      alert('Leave rejected!');
      fetchLeaves();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

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

