import React, { useEffect, useState } from 'react';
import { apiService } from '../utils/apiService';
import styles from '../styles/Rooms.module.css';

export default function Rooms() {
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
            setRooms(res.data.rooms || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load rooms');
            console.error('Error fetching rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <main className={styles.container} style={{ padding: 20 }}>
            <h1>Available Rooms</h1>
            {error && <div className={styles.error}>{error}</div>}
            {rooms.length === 0 && !loading && <p>No rooms available</p>}
            <ul className={styles.roomsList}>
                {rooms.map(room => (
                    <li key={room.id} className={styles.roomItem}>
                        <strong>{room.room_type}</strong> — ${room.price}/night
                        <p>Capacity: {room.capacity} | Status: {room.status}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
