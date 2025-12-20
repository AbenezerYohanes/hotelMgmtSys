import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Billing.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Billing = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBillings();
  }, [filter]);

  const fetchBillings = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await axios.get(`${API_URL}/billing`, { params });
      setBillings(res.data.billings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (id, paymentMethod) => {
    try {
      await axios.put(`${API_URL}/billing/${id}/pay`, { payment_method: paymentMethod });
      alert('Payment processed successfully!');
      fetchBillings();
    } catch (err) {
      alert('Payment failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

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

