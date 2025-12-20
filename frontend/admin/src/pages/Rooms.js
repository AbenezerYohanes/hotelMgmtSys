import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Rooms.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_URL}/rooms`);
      setRooms(res.data.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rooms-page">
      <h2>Rooms Management</h2>
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

