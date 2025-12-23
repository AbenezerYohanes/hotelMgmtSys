import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from '../components/Modal';
import './Dashboard.css';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPermissions, setEditPermissions] = useState('{}');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (showRolesModal) {
      fetchRoles();
    }
  }, [showRolesModal]);

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

  const fetchRoles = async () => {
    try {
      const res = await apiService.getRoles();
      setRoles(res.data.roles);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const addRole = async () => {
    if (!newRole.trim()) return;
    try {
      await apiService.createRole({ name: newRole, permissions: {} });
      setNewRole('');
      fetchRoles();
    } catch (err) {
      console.error('Error adding role:', err);
    }
  };

  const startEdit = (role) => {
    setEditingRole(role.id);
    setEditName(role.name);
    setEditPermissions(JSON.stringify(role.permissions));
  };

  const saveEdit = async () => {
    try {
      const permissions = JSON.parse(editPermissions);
      await apiService.updateRole(editingRole, { name: editName, permissions });
      setEditingRole(null);
      setEditName('');
      setEditPermissions('{}');
      fetchRoles();
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const deleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await apiService.deleteRole(id);
      fetchRoles();
    } catch (err) {
      console.error('Error deleting role:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="sidebar">
          <Link to="/">Dashboard</Link>
          <Link to="/hotels">Hotels</Link>
          <button onClick={() => setShowRolesModal(true)}>Roles</button>
          <Link to="/employees">Employees</Link>
        </div>
        <div className="main-content">
          <h2>Global Analytics</h2>
          {error && <div className="error-banner">{error}</div>}
          {analytics && (
            <>
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
              <div className="chart-container">
                <h3>Analytics Overview</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={[
                    { name: 'Hotels', value: analytics.totalHotels },
                    { name: 'Employees', value: analytics.totalEmployees },
                    { name: 'Departments', value: analytics.totalDepartments }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
      {showRolesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Role Management</h2>
              <button className="modal-close" onClick={() => setShowRolesModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <h3>Manage Roles</h3>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Enter new role name"
                />
                <button onClick={addRole}>Add Role</button>
              </div>
              <div>
                {roles.map((role) => (
                  <div key={role.id} className="role-item">
                    {editingRole === role.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <textarea
                          value={editPermissions}
                          onChange={(e) => setEditPermissions(e.target.value)}
                          rows="2"
                        />
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={() => setEditingRole(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <strong>{role.name}</strong> - {JSON.stringify(role.permissions)}
                        <div className="role-actions">
                          <button onClick={() => startEdit(role)}>Edit</button>
                          <button onClick={() => deleteRole(role.id)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;