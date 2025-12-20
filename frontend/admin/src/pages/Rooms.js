import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="rooms-page">
      <h2>Rooms Management</h2>
      {error && <div className="error-banner">{error}</div>}
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

