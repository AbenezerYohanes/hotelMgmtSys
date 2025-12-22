import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../common/utils/apiService';
import Modal from '../common/components/Modal';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    address: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getMyProfile();
      setProfile(res.data.employee);
      setFormData({
        first_name: res.data.employee.first_name,
        last_name: res.data.employee.last_name,
        email: res.data.employee.email,
        contact: res.data.employee.contact || '',
        address: res.data.employee.address || ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.updateMyProfile(formData);
      setSuccessMessage('Profile updated!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowEditModal(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>My Profile</h2>
        <button onClick={() => setShowEditModal(true)} className="btn-primary">
          Edit Profile
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows="3"
          />
          <button type="submit">Update Profile</button>
        </form>
      </Modal>
      <div className="profile-details">
        <p><strong>First Name:</strong> {profile.first_name}</p>
        <p><strong>Last Name:</strong> {profile.last_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Contact:</strong> {profile.contact || 'N/A'}</p>
        <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
        <p><strong>Role:</strong> {profile.role?.name || 'Staff'}</p>
        <p><strong>Status:</strong> {profile.status}</p>
        {profile.picture && (
          <div>
            <strong>Picture:</strong>
            <img src={`http://localhost:4000${profile.picture}`} alt="Profile" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

