import React, { useState, useEffect } from 'react';
import { apiService } from '../common/utils/apiService';
import Modal from '../common/components/Modal';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    guest_id: '',
    room_id: '',
    start_date: '',
    end_date: '',
    total_price: ''
  });

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  useEffect(() => {
    if (showCreateModal) {
      fetchGuestsAndRooms();
    }
  }, [showCreateModal]);

  const fetchGuestsAndRooms = async () => {
    try {
      const [guestsRes, roomsRes] = await Promise.all([
        apiService.getGuests(),
        apiService.getRooms()
      ]);
      setGuests(guestsRes.data.guests);
      setRooms(roomsRes.data.rooms);
    } catch (err) {
      console.error('Error fetching guests and rooms:', err);
    }
  };

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

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    try {
      await apiService.createReservation(formData);
      setSuccessMessage('Reservation created successfully!');
      setShowCreateModal(false);
      setFormData({
        guest_id: '',
        room_id: '',
        start_date: '',
        end_date: '',
        total_price: ''
      });
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create reservation');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Reservation">
        <form onSubmit={handleCreateReservation}>
          <div className="form-group">
            <label htmlFor="guest_id">Guest</label>
            <select
              id="guest_id"
              name="guest_id"
              value={formData.guest_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Guest</option>
              {guests.map(guest => (
                <option key={guest.id} value={guest.id}>
                  {guest.first_name} {guest.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="room_id">Room</label>
            <select
              id="room_id"
              name="room_id"
              value={formData.room_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.room_type} - ${room.price}/night
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start_date">Check-In Date</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">Check-Out Date</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="total_price">Total Price</label>
            <input
              type="number"
              id="total_price"
              name="total_price"
              value={formData.total_price}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Reservation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reservations;

