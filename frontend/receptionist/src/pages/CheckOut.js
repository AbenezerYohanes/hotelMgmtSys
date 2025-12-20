import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckOut.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const CheckOut = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckedIn();
  }, []);

  const fetchCheckedIn = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservations`, { params: { status: 'checked_in' } });
      setReservations(res.data.reservations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (id) => {
    if (!window.confirm('Confirm check-out?')) return;
    
    try {
      await axios.put(`${API_URL}/reservations/${id}/checkout`);
      alert('Check-out successful!');
      fetchCheckedIn();
    } catch (err) {
      alert('Check-out failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="checkout-page">
      <h2>Check-Out</h2>
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

