import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Rooms.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRooms();
  }, [filter]);

  const fetchRooms = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await axios.get(`${API_URL}/rooms`, { params });
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

