import React, { useState, useEffect } from 'react';
import { apiService } from 'frontend-common/utils/apiService';
import './Departments.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getDepartments();
      setDepartments(res.data.departments);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load departments');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createDepartment(formData);
      setSuccessMessage('Department created!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateModal(false);
      setFormData({ name: '' });
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create department');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="departments-page">
      <div className="page-header">
        <h2>Departments</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Add Department
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Department">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <button type="submit">Create Department</button>
        </form>
      </Modal>
      <div className="departments-grid">
        {departments.map((dept) => (
          <div key={dept.id} className="department-card">
            <h3>{dept.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;

