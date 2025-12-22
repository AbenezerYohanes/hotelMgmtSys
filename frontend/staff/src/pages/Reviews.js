import React, { useState, useEffect } from 'react';
import { apiService } from '../common/utils/apiService';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getMyReviews();
      setReviews(res.data.reviews);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="reviews-page">
      <h2>My Performance Reviews</h2>
      {error && <div className="error-banner">{error}</div>}
      {reviews.length === 0 && !loading && <p>No performance reviews found</p>}
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <p><strong>Date:</strong> {review.date}</p>
            <p><strong>Rating:</strong> {review.rating}/10</p>
            <p><strong>Reviewer:</strong> {review.reviewer ? `${review.reviewer.first_name} ${review.reviewer.last_name}` : 'N/A'}</p>
            <p><strong>Comments:</strong> {review.comments || 'No comments'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;

