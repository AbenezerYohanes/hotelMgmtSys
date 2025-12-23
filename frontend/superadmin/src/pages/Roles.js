import React, { useState, useEffect } from 'react';
import { apiService } from '../utils/apiService';
import './Roles.css';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: '{}'
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getRoles();
      setRoles(res.data.roles);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load roles');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const permissions = JSON.parse(formData.permissions);
      if (editingRole) {
        await apiService.updateRole(editingRole, { name: formData.name, permissions });
        setSuccessMessage('Role updated!');
        setEditingRole(null);
      } else {
        await apiService.createRole({ name: formData.name, permissions });
        setSuccessMessage('Role created!');
      }
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowForm(false);
      setFormData({ name: '', permissions: '{}' });
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save role');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role.id);
    setFormData({ name: role.name, permissions: JSON.stringify(role.permissions) });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await apiService.deleteRole(id);
      setSuccessMessage('Role deleted!');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchRoles();
    } catch (err) {
      setError('Failed to delete role');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="roles-page">
      <div className="page-header">
        <h2>Roles Management</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingRole(null); setFormData({ name: '', permissions: '{}' }); }} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Role'}
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="role-form">
          <input
            type="text"
            placeholder="Role Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder='Permissions (JSON, e.g., {"all": true})'
            value={formData.permissions}
            onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
            rows="4"
          />
          <button type="submit">{editingRole ? 'Update Role' : 'Create Role'}</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>{JSON.stringify(role.permissions)}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleEdit(role)}>Edit</button>
                  <button onClick={() => handleDelete(role.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;

