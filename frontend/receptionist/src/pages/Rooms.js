import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import Modal from '../../../common/components/Modal';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchRooms();
  }, [filter]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await apiService.getRooms(params);
      setRooms(res.data.rooms);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (room) => {
    setSelectedRoom(room);
    setNewStatus(room.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.updateRoomStatus(selectedRoom.id, { status: newStatus });
      setSuccessMessage('Room status updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowStatusModal(false);
      setSelectedRoom(null);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update room status');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="rooms-page">
      <div className="page-header">
        <h2>Rooms</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
          <option value="cleaning">Cleaning</option>
        </select>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {rooms.length === 0 && !loading && <p>No rooms found</p>}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className={`room-card status-${room.status}`}>
            <h3>{room.room_type}</h3>
            <p><strong>Location:</strong> {room.location || 'N/A'}</p>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><strong>Price:</strong> ${room.price}/night</p>
            <p><strong>Status:</strong>
              <span className={`status-badge status-${room.status}`}>
                {room.status}
              </span>
            </p>
            {room.amenities && (
              <div className="amenities">
                <strong>Amenities:</strong>
                <ul>
                  {JSON.parse(room.amenities || '[]').map((amenity, idx) => (
                    <li key={idx}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;

