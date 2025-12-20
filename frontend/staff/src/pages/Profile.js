import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../../../common/utils/apiService';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getMyProfile();
      setProfile(res.data.employee);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      {error && <div className="error-banner">{error}</div>}
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

