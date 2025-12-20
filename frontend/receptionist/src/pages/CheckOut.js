import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './CheckOut.css';

const CheckOut = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchCheckedIn();
  }, []);

  const fetchCheckedIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getReservations({ status: 'checked_in' });
      setReservations(res.data.reservations);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (id) => {
    if (!window.confirm('Confirm check-out?')) return;
    
    try {
      await apiService.checkOut(id);
      setSuccessMessage('Check-out successful!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchCheckedIn();
    } catch (err) {
      setError(err.response?.data?.error || 'Check-out failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="checkout-page">
      <h2>Check-Out</h2>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <div className="reservations-list">
        {reservations.length === 0 ? (
          <p>No guests to check out</p>
        ) : (
          reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="card-header">
                <h3>{reservation.guest?.first_name} {reservation.guest?.last_name}</h3>
                <span className="status-badge">{reservation.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Room:</strong> {reservation.room?.room_type}</p>
                <p><strong>Check-In:</strong> {reservation.start_date}</p>
                <p><strong>Check-Out:</strong> {reservation.end_date}</p>
                <p><strong>Total:</strong> ${reservation.total_price}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => handleCheckOut(reservation.id)} className="btn-primary">
                  Check-Out
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CheckOut;

