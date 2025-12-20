import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Leaves.css';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leaves-page">
      <h2>My Leave Requests</h2>
      {error && <div className="error-banner">{error}</div>}
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

