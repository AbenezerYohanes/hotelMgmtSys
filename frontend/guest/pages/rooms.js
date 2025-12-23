import React, { useEffect, useState } from 'react';
import { apiService } from '../utils/apiService';
import Modal from '../../common/components/Modal';
import styles from '../styles/Rooms.module.css';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [formData, setFormData] = useState({
        guest_id: '',
        start_date: '',
        end_date: '',
        total_price: ''
    });

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

    const handleBookRoom = (room) => {
        setSelectedRoom(room);
        setShowBookingModal(true);
        setFormData({
            guest_id: '',
            start_date: '',
            end_date: '',
            total_price: room.price.toString()
        });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const bookingData = {
                ...formData,
                room_id: selectedRoom.id
            };
            await apiService.createReservation(bookingData);
            setSuccessMessage('Room booked successfully!');
            setShowBookingModal(false);
            setSelectedRoom(null);
            setFormData({
                guest_id: '',
                start_date: '',
                end_date: '',
                total_price: ''
            });
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book room');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <main className={styles.container} style={{ padding: 20 }}>
            <h1>Available Rooms</h1>
            {error && <div className={styles.error}>{error}</div>}
            {successMessage && <div className={styles.success}>{successMessage}</div>}
            {rooms.length === 0 && !loading && <p>No rooms available</p>}
            <ul className={styles.roomsList}>
                {rooms.map(room => (
                    <li key={room.id} className={styles.roomItem}>
                        <strong>{room.room_type}</strong> — ${room.price}/night
                        <p>Capacity: {room.capacity} | Status: {room.status}</p>
                        <button onClick={() => handleBookRoom(room)} className={styles.bookButton}>
                            Book Now
                        </button>
                    </li>
                ))}
            </ul>

            <Modal show={showBookingModal} onClose={() => setShowBookingModal(false)} title={`Book ${selectedRoom?.room_type}`}>
                <form onSubmit={handleBookingSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="guest_id">Guest ID</label>
                        <input
                            type="text"
                            id="guest_id"
                            name="guest_id"
                            value={formData.guest_id}
                            onChange={handleInputChange}
                            placeholder="Enter your guest ID"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="start_date">Check-In Date</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="end_date">Check-Out Date</label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="total_price">Total Price</label>
                        <input
                            type="number"
                            id="total_price"
                            name="total_price"
                            value={formData.total_price}
                            onChange={handleInputChange}
                            step="0.01"
                            required
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setShowBookingModal(false)} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            Book Room
                        </button>
                    </div>
                </form>
            </Modal>
        </main>
    );
}
