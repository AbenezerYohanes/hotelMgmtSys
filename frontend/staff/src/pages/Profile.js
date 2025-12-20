import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees/me/profile`);
      setProfile(res.data.employee);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
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

