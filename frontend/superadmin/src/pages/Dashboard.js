import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from 'frontend-common/utils/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getAnalytics();
      setAnalytics(res.data.analytics);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>SuperAdmin Dashboard</h1>
        <div>
          <span>Welcome, {user?.first_name} {user?.last_name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="sidebar">
          <Link to="/">Dashboard</Link>
          <Link to="/hotels">Hotels</Link>
          <Link to="/roles">Roles</Link>
          <Link to="/employees">Employees</Link>
        </div>
        <div className="main-content">
          <h2>Global Analytics</h2>
          {error && <div className="error-banner">{error}</div>}
          {analytics && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Hotels</h3>
                <p className="stat-number">{analytics.totalHotels}</p>
              </div>
              <div className="stat-card">
                <h3>Total Employees</h3>
                <p className="stat-number">{analytics.totalEmployees}</p>
              </div>
              <div className="stat-card">
                <h3>Total Departments</h3>
                <p className="stat-number">{analytics.totalDepartments}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

