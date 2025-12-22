import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import Modal from '../../../common/components/Modal';
import './Guests.css';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    address: ''
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getGuests();
      setGuests(res.data.guests);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load guests');
      console.error('Error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuest = async (e) => {
    e.preventDefault();
    try {
      await apiService.createGuest(formData);
      setSuccessMessage('Guest created successfully!');
      setShowCreateModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        contact: '',
        address: ''
      });
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchGuests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create guest');
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

  const filteredGuests = guests.filter(guest =>
    guest.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="guests-page">
      <div className="page-header">
        <h2>Guests</h2>
        <div className="header-actions">
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            Add Guest
          </button>
          <input
            type="text"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {filteredGuests.length === 0 && !loading && <p>No guests found</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGuests.map((guest) => (
            <tr key={guest.id}>
              <td>{guest.first_name} {guest.last_name}</td>
              <td>{guest.email}</td>
              <td>{guest.contact || 'N/A'}</td>
              <td>{guest.address || 'N/A'}</td>
              <td>
                <button onClick={() => window.location.href = `/guests/${guest.id}`}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Guest">
        <form onSubmit={handleCreateGuest}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Guest
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Guests;

