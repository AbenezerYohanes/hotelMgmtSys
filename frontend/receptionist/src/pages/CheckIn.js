import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckIn.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const CheckIn = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchPendingCheckIns();
  }, []);

  const fetchPendingCheckIns = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservations`, { params: { status: 'confirmed' } });
      setReservations(res.data.reservations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id) => {
    if (!window.confirm('Confirm check-in?')) return;
    
    try {
      await axios.put(`${API_URL}/reservations/${id}/checkin`);
      alert('Check-in successful!');
      fetchPendingCheckIns();
    } catch (err) {
      alert('Check-in failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="checkin-page">
      <h2>Check-In</h2>
      <div className="reservations-list">
        {reservations.length === 0 ? (
          <p>No pending check-ins</p>
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
                <button onClick={() => handleCheckIn(reservation.id)} className="btn-primary">
                  Check-In
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CheckIn;

