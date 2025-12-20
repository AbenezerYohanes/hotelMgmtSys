import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hotels.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    email: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${API_URL}/superadmin/hotels`);
      setHotels(res.data.hotels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/superadmin/hotels`, formData);
      alert('Hotel created!');
      setShowForm(false);
      setFormData({ name: '', location: '', contact: '', email: '' });
      fetchHotels();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await axios.delete(`${API_URL}/superadmin/hotels/${id}`);
      alert('Hotel deleted!');
      fetchHotels();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="hotels-page">
      <div className="page-header">
        <h2>Hotels Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Hotel'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="hotel-form">
          <input
            type="text"
            placeholder="Hotel Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button type="submit">Create Hotel</button>
        </form>
      )}
      <div className="hotels-grid">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <h3>{hotel.name}</h3>
            <p><strong>Location:</strong> {hotel.location || 'N/A'}</p>
            <p><strong>Contact:</strong> {hotel.contact || 'N/A'}</p>
            <p><strong>Email:</strong> {hotel.email || 'N/A'}</p>
            <div className="card-actions">
              <button onClick={() => handleDelete(hotel.id)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;

