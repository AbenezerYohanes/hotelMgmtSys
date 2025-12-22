import React, { useState, useEffect } from 'react';
import { apiService } from 'frontend-common';
import './Hotels.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
      setLoading(true);
      setError(null);
      const res = await apiService.getHotels();
      setHotels(res.data.hotels);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createHotel(formData);
      setSuccessMessage('Hotel created!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowForm(false);
      setFormData({ name: '', location: '', contact: '', email: '' });
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create hotel');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      setError(null);
      await apiService.deleteHotel(id);
      setSuccessMessage('Hotel deleted!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchHotels();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete hotel');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="hotels-page">
      <div className="page-header">
        <h2>Hotels Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Hotel'}
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
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

