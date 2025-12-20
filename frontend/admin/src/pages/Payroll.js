import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Payroll.css';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    salary: '',
    allowances: '',
    deductions: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [payrollsRes, employeesRes] = await Promise.all([
        apiService.getPayrolls(),
        apiService.getEmployees()
      ]);
      setPayrolls(payrollsRes.data.payrolls);
      setEmployees(employeesRes.data.employees);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await apiService.createPayroll(formData);
      setSuccessMessage('Payroll created!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowForm(false);
      setFormData({ employee_id: '', salary: '', allowances: '', deductions: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create payroll');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="payroll-page">
      <div className="page-header">
        <h2>Payroll Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Payroll'}
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="payroll-form">
          <select
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Salary"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Allowances"
            value={formData.allowances}
            onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
          />
          <input
            type="number"
            placeholder="Deductions"
            value={formData.deductions}
            onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <button type="submit">Create Payroll</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Net Amount</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((payroll) => (
            <tr key={payroll.id}>
              <td>{payroll.employee?.first_name} {payroll.employee?.last_name}</td>
              <td>{payroll.date}</td>
              <td>${parseFloat(payroll.salary).toFixed(2)}</td>
              <td>${parseFloat(payroll.allowances).toFixed(2)}</td>
              <td>${parseFloat(payroll.deductions).toFixed(2)}</td>
              <td>${(parseFloat(payroll.salary) + parseFloat(payroll.allowances) - parseFloat(payroll.deductions)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payroll;

