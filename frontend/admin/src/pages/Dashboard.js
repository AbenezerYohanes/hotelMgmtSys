import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/apiService';


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
      const res = await apiService.getHRDashboard();
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
          {error && <div className="error-banner">{error}</div>}
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

