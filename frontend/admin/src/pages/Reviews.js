import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reviews.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    rating: 5,
    comments: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, employeesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/hr/reviews`),
        axios.get(`${API_URL}/employees`)
      ]);
      setReviews(reviewsRes.data.reviews);
      setEmployees(employeesRes.data.employees);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/hr/reviews`, formData);
      alert('Review created!');
      setShowForm(false);
      setFormData({ employee_id: '', rating: 5, comments: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h2>Performance Reviews</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Review'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
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
            min="0"
            max="10"
            placeholder="Rating (0-10)"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            required
          />
          <textarea
            placeholder="Comments"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            rows="4"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <button type="submit">Create Review</button>
        </form>
      )}
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h3>{review.employee?.first_name} {review.employee?.last_name}</h3>
            <p><strong>Rating:</strong> {review.rating}/10</p>
            <p><strong>Date:</strong> {review.date}</p>
            <p><strong>Reviewer:</strong> {review.reviewer?.first_name} {review.reviewer?.last_name}</p>
            <p><strong>Comments:</strong> {review.comments || 'No comments'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;

