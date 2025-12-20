import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await apiService.getReservations(params);
      setReservations(res.data.reservations);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id) => {
    if (!window.confirm('Confirm check-in?')) return;
    try {
      await apiService.checkIn(id);
      setSuccessMessage('Check-in successful!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCheckOut = async (id) => {
    if (!window.confirm('Confirm check-out?')) return;
    try {
      await apiService.checkOut(id);
      setSuccessMessage('Check-out successful!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.error || 'Check-out failed');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="reservations-page">
      <div className="page-header">
        <h2>Reservations</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {reservations.length === 0 && !loading && <p>No reservations found</p>}
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.guest?.first_name} {reservation.guest?.last_name}</td>
              <td>{reservation.room?.room_type}</td>
              <td>{reservation.start_date}</td>
              <td>{reservation.end_date}</td>
              <td>${reservation.total_price}</td>
              <td>
                <span className={`status-badge status-${reservation.status}`}>
                  {reservation.status}
                </span>
              </td>
              <td>
                {reservation.status === 'confirmed' && (
                  <button onClick={() => handleCheckIn(reservation.id)} className="btn-checkin">
                    Check-In
                  </button>
                )}
                {reservation.status === 'checked_in' && (
                  <button onClick={() => handleCheckOut(reservation.id)} className="btn-checkout">
                    Check-Out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservations;

