import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payroll.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees/me/payroll`);
      setPayrolls(res.data.payrolls);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="payroll-page">
      <h2>My Payroll</h2>
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

