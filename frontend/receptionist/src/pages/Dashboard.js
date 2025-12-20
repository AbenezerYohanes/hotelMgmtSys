import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/receptionists/dashboard`);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

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

