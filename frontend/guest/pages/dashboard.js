import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiService } from '../utils/apiService';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const [guest, setGuest] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [guestRes, reservationsRes] = await Promise.all([
        apiService.getMyGuestProfile(),
        apiService.getMyReservations()
      ]);
      setGuest(guestRes.data.guest);
      setReservations(reservationsRes.data.reservations);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1>My Dashboard</h1>
        <div>
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <main className={styles.main}>
        <h2>Welcome, {guest?.first_name} {guest?.last_name}</h2>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.section}>
          <h3>My Reservations</h3>
          {reservations.length === 0 ? (
            <p>No reservations yet. <Link href="/">Book a room</Link></p>
          ) : (
            <div className={styles.reservations}>
              {reservations.map((reservation) => (
                <div key={reservation.id} className={styles.reservationCard}>
                  <p><strong>Room:</strong> {reservation.room?.room_type}</p>
                  <p><strong>Check-in:</strong> {reservation.start_date}</p>
                  <p><strong>Check-out:</strong> {reservation.end_date}</p>
                  <p><strong>Total:</strong> ${reservation.total_price}</p>
                  <p><strong>Status:</strong> {reservation.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

