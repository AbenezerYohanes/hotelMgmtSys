import React, { useState, useEffect } from 'react';
import { apiService } from '../utils/apiService';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getRooms();
      setRooms(res.data.rooms);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1>Grand Hotel</h1>
        <div>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </nav>
      <main className={styles.main}>
        <h2>Welcome to Grand Hotel</h2>
        <p>Book your perfect stay with us</p>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? (
          <p>Loading rooms...</p>
        ) : (
          <div className={styles.roomsGrid}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.roomCard}>
                <h3>{room.room_type}</h3>
                <p>Capacity: {room.capacity}</p>
                <p>Price: ${room.price}/night</p>
                <p>Status: {room.status}</p>
                <Link href={`/rooms/${room.id}`}>View Details</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
