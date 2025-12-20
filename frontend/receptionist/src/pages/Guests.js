import React, { useState, useEffect } from 'react';
import { apiService } from '../../../common/utils/apiService';
import './Guests.css';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getGuests();
      setGuests(res.data.guests);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load guests');
      console.error('Error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="guests-page">
      <div className="page-header">
        <h2>Guests</h2>
        <input
          type="text"
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {error && <div className="error-banner">{error}</div>}
      {filteredGuests.length === 0 && !loading && <p>No guests found</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGuests.map((guest) => (
            <tr key={guest.id}>
              <td>{guest.first_name} {guest.last_name}</td>
              <td>{guest.email}</td>
              <td>{guest.contact || 'N/A'}</td>
              <td>{guest.address || 'N/A'}</td>
              <td>
                <button onClick={() => window.location.href = `/guests/${guest.id}`}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Guests;

