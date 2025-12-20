import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Departments.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/hr/departments`);
      setDepartments(res.data.departments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/hr/departments`, formData);
      alert('Department created!');
      setShowForm(false);
      setFormData({ name: '' });
      fetchDepartments();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="departments-page">
      <div className="page-header">
        <h2>Departments</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Department'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="department-form">
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <button type="submit">Create Department</button>
        </form>
      )}
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

