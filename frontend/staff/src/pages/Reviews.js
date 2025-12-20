import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reviews.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees/me/reviews`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="reviews-page">
      <h2>My Performance Reviews</h2>
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

