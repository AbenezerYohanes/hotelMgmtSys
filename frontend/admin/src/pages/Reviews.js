import React, { useState, useEffect } from 'react';
import { apiService } from 'frontend-common/utils/apiService';
import Modal from '../components/Modal';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      setLoading(true);
      setError(null);
      const [reviewsRes, employeesRes] = await Promise.all([
        apiService.getReviews(),
        apiService.getEmployees()
      ]);
      setReviews(reviewsRes.data.reviews);
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
      await apiService.createReview(formData);
      setSuccessMessage('Review created!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateModal(false);
      setFormData({ employee_id: '', rating: 5, comments: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create review');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h2>Performance Reviews</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Add Review
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add Performance Review">
        <form onSubmit={handleSubmit}>
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
      </Modal>
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

