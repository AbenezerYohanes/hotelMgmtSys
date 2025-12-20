import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roles.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    permissions: '{}'
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/superadmin/roles`);
      setRoles(res.data.roles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const permissions = JSON.parse(formData.permissions);
      await axios.post(`${API_URL}/superadmin/roles`, { name: formData.name, permissions });
      alert('Role created!');
      setShowForm(false);
      setFormData({ name: '', permissions: '{}' });
      fetchRoles();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="roles-page">
      <div className="page-header">
        <h2>Roles Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Role'}
        </button>
      </div>
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
          <button type="submit">Create Role</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>{JSON.stringify(role.permissions)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;

