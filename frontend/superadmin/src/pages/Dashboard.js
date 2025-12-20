import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/superadmin/analytics`);
      setAnalytics(res.data.analytics);
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

