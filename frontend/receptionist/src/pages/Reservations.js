import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reservations.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await axios.get(`${API_URL}/reservations`, { params });
      setReservations(res.data.reservations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await axios.put(`${API_URL}/reservations/${id}/checkin`);
      fetchReservations();
      alert('Check-in successful!');
    } catch (err) {
      alert('Check-in failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.put(`${API_URL}/reservations/${id}/checkout`);
      fetchReservations();
      alert('Check-out successful!');
    } catch (err) {
      alert('Check-out failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

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

