import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { apiService } from '../utils/apiService';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
    contact: '',
    address: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getEmployees();
      setEmployees(res.data.employees);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employees');
      console.error('Error fetching employees:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createEmployee(formData);
      setSuccessMessage('Employee created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateModal(false);
      setFormData({ first_name: '', last_name: '', email: '', password: '', role_id: '', contact: '', address: '' });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleToggleStatus = async (employeeId, currentStatus) => {
    try {
      setError(null);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiService.updateEmployeeStatus(employeeId, { status: newStatus });
      setSuccessMessage(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee status');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="employees-page">
      <div className="page-header">
        <h2>Employees</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Add Employee
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Employee">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role_id">Role</label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Create Employee
            </button>
          </div>
        </form>
      </Modal>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.first_name} {employee.last_name}</td>
              <td>{employee.email}</td>
              <td>{employee.role?.name || 'N/A'}</td>
              <td>{employee.contact || 'N/A'}</td>
              <td>
                <span className={`status-badge status-${employee.status}`}>
                  {employee.status}
                </span>
              </td>
              <td>
                <button
                  className={`status-toggle-button ${employee.status === 'active' ? 'deactivate' : 'activate'}`}
                  onClick={() => handleToggleStatus(employee.id, employee.status)}
                  disabled={employee.role && ['admin', 'superadmin'].includes(employee.role.name.toLowerCase()) && employee.status === 'active'}
                  title={employee.role && ['admin', 'superadmin'].includes(employee.role.name.toLowerCase()) && employee.status === 'active' ? 'Cannot deactivate admin or superadmin accounts' : ''}
                >
                  {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;

