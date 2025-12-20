import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../../../common/utils/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
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

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Staff Dashboard</h1>
        <div>
          <span>Welcome, {user?.first_name} {user?.last_name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="sidebar">
          <Link to="/">Dashboard</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/leaves">Leave Requests</Link>
          <Link to="/payroll">Payroll</Link>
          <Link to="/reviews">Performance Reviews</Link>
        </div>
        <div className="main-content">
          <h2>Welcome to Your Dashboard</h2>
          {error && <div className="error-banner">{error}</div>}
          {profile && (
            <div className="profile-card">
              <h3>Your Information</h3>
              <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role?.name || 'Staff'}</p>
              <p><strong>Status:</strong> {profile.status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

