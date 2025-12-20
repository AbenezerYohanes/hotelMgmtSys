import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Guests.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await axios.get(`${API_URL}/guests`);
      setGuests(res.data.guests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

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

