import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Billing.css';

const Billing = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBillings();
  }, [filter]);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await apiService.getBillings(params);
      setBillings(res.data.billings);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load billings');
      console.error('Error fetching billings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (id, paymentMethod) => {
    if (!window.confirm(`Process payment as ${paymentMethod}?`)) return;
    try {
      await apiService.processPayment(id, { payment_method: paymentMethod });
      setSuccessMessage('Payment processed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchBillings();
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="billing-page">
      <div className="page-header">
        <h2>Billing & Payments</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {billings.length === 0 && !loading && <p>No billings found</p>}
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Reservation</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {billings.map((billing) => (
            <tr key={billing.id}>
              <td>{billing.guest?.first_name} {billing.guest?.last_name}</td>
              <td>#{billing.reservation_id || 'N/A'}</td>
              <td>${billing.amount}</td>
              <td>{billing.payment_method || 'N/A'}</td>
              <td>
                <span className={`status-badge status-${billing.status}`}>
                  {billing.status}
                </span>
              </td>
              <td>
                {billing.status === 'pending' && (
                  <div className="payment-actions">
                    <button onClick={() => handlePayment(billing.id, 'cash')}>Cash</button>
                    <button onClick={() => handlePayment(billing.id, 'credit_card')}>Card</button>
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

export default Billing;

