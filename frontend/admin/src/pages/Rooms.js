import React, { useState, useEffect } from 'react';
import { apiService } from '../utils/apiService';
import Modal from '../components/Modal';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getRooms();
      setRooms(res.data.rooms);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createRoom(formData);
      setSuccessMessage('Room created!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateModal(false);
      setFormData({ room_type: '', location: '', capacity: 1, price: 0, status: 'available' });
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create room');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="rooms-page">
      <div className="page-header">
        <h2>Rooms Management</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Add Room
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Room">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Room Type"
            value={formData.room_type}
            onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <input
            type="number"
            min="1"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price per night"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button type="submit">Create Room</button>
        </form>
      </Modal>
      {rooms.length === 0 && !loading && <p>No rooms found</p>}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h3>{room.room_type}</h3>
            <p><strong>Location:</strong> {room.location || 'N/A'}</p>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><strong>Price:</strong> ${room.price}/night</p>
            <p><strong>Status:</strong>
              <span className={`status-badge status-${room.status}`}>
                {room.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;

