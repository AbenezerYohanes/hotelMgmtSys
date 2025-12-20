import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_URL}/rooms`);
      setRooms(res.data.rooms);
    } catch (err) {
      console.error(err);
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
