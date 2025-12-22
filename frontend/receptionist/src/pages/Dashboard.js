import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../common/utils/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getReceptionistDashboard();
      setStats(res.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Receptionist Dashboard</h1>
        <div>
          <span>Welcome, {user?.first_name} {user?.last_name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="sidebar">
          <Link to="/">Dashboard</Link>
          <Link to="/guests">Guests</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/checkin">Check-In</Link>
          <Link to="/checkout">Check-Out</Link>
          <Link to="/billing">Billing</Link>
          <Link to="/rooms">Rooms</Link>
        </div>
        <div className="main-content">
          <h2>Dashboard Overview</h2>
          {error && <div className="error-banner">{error}</div>}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Reservations</h3>
                <p className="stat-number">{stats.totalReservations}</p>
              </div>
              <div className="stat-card">
                <h3>Today's Check-Ins</h3>
                <p className="stat-number">{stats.todayCheckIns}</p>
              </div>
              <div className="stat-card">
                <h3>Today's Check-Outs</h3>
                <p className="stat-number">{stats.todayCheckOuts}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Reservations</h3>
                <p className="stat-number">{stats.pendingReservations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

