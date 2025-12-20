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
      const res = await axios.get(`${API_URL}/admin/hr/dashboard`);
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
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user?.first_name} {user?.last_name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="sidebar">
          <Link to="/">Dashboard</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/leaves">Leave Requests</Link>
          <Link to="/payroll">Payroll</Link>
          <Link to="/reviews">Performance Reviews</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/rooms">Rooms</Link>
        </div>
        <div className="main-content">
          <h2>HR Dashboard Overview</h2>
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Employees</h3>
                <p className="stat-number">{stats.totalEmployees}</p>
              </div>
              <div className="stat-card">
                <h3>Total Departments</h3>
                <p className="stat-number">{stats.totalDepartments}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Leaves</h3>
                <p className="stat-number">{stats.pendingLeaves}</p>
              </div>
              <div className="stat-card">
                <h3>Today's Attendance</h3>
                <p className="stat-number">{stats.todayAttendance}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

