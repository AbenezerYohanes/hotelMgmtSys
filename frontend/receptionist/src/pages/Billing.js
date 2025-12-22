import React, { useState, useEffect } from 'react';
import { apiService } from '../common/utils/apiService';
import Modal from '../common/components/Modal';
import './Billing.css';

const Billing = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    reservation_id: '',
    amount: '',
    payment_method: 'cash'
  });

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

  const fetchReservations = async () => {
    try {
      const res = await apiService.getReservations();
      setReservations(res.data.reservations);
    } catch (err) {
      console.error('Error fetching reservations:', err);
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
        <div className="header-actions">
          <button onClick={openCreateModal} className="btn-primary">Create Billing</button>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
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
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Billing">
        <form onSubmit={handleCreateBilling}>
          <div className="form-group">
            <label htmlFor="reservation_id">Reservation</label>
            <select
              id="reservation_id"
              name="reservation_id"
              value={formData.reservation_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Reservation</option>
              {reservations.map((reservation) => (
                <option key={reservation.id} value={reservation.id}>
                  #{reservation.id} - {reservation.guest?.first_name} {reservation.guest?.last_name} ({reservation.room?.room_type})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="payment_method">Payment Method</label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Create Billing
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Billing;

