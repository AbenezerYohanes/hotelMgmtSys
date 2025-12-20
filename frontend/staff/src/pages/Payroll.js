import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Payroll.css';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getMyPayroll();
      setPayrolls(res.data.payrolls);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load payroll');
      console.error('Error fetching payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="payroll-page">
      <h2>My Payroll</h2>
      {error && <div className="error-banner">{error}</div>}
      {payrolls.length === 0 && !loading && <p>No payroll records found</p>}
      <table>
        <thead>
          <tr>
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

