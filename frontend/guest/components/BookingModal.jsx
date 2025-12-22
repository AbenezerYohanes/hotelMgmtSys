import React, { useState } from 'react';
import { apiService } from '../utils/apiService';

export default function BookingModal({ open, room, onClose, onBooked }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ check_in: '', check_out: '', guest_name: '', guest_email: '', guests: 1 });

    if (!open || !room) return null;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload = {
                room_id: room.id || room._id || room.id,
                check_in: form.check_in,
                check_out: form.check_out,
                guest_name: form.guest_name,
                guest_email: form.guest_email,
                guests: Number(form.guests || 1),
            };
            await apiService.createReservation(payload);
            onBooked && onBooked(payload);
            onClose();
            alert('Reservation created successfully');
        } catch (err) {
            console.error('Booking error', err);
            setError(err.response?.data?.error || 'Failed to create reservation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#fff', borderRadius: 8, width: '92%', maxWidth: 520, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Book: {room.room_type || room.name || 'Room'}</h3>
                    <button onClick={onClose} aria-label="close">✕</button>
                </div>
                <form onSubmit={submit} style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                    <label>
                        Check-in
                        <input name="check_in" type="date" value={form.check_in} onChange={handleChange} required />
                    </label>
                    <label>
                        Check-out
                        <input name="check_out" type="date" value={form.check_out} onChange={handleChange} required />
                    </label>
                    <label>
                        Your name
                        <input name="guest_name" value={form.guest_name} onChange={handleChange} placeholder="Full name" required />
                    </label>
                    <label>
                        Email
                        <input name="guest_email" type="email" value={form.guest_email} onChange={handleChange} placeholder="you@example.com" required />
                    </label>
                    <label>
                        Guests
                        <input name="guests" type="number" min="1" value={form.guests} onChange={handleChange} />
                    </label>
                    {error && <div style={{ color: 'crimson' }}>{error}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={loading} style={{ background: '#0070f3', color: '#fff' }}>{loading ? 'Booking...' : 'Confirm Booking'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
