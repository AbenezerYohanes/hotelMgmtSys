import React, { useEffect, useState } from 'react'
import { apiService } from '../utils/apiService'
import BookingModal from '../components/BookingModal'
import styles from '../styles/Home.module.css'

export default function GuestHome() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterGuests, setFilterGuests] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => { fetchRooms() }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiService.getRooms()
      setRooms(res.data.rooms || res.data || [])
    } catch (err) {
      console.error('Error loading rooms', err)
      setError(err.response?.data?.error || 'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  const openBooking = (room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleBooked = () => {
    // simple refresh after booking
    fetchRooms()
  }

  const available = (r) => {
    if (!r) return false
    const okCapacity = (r.capacity || r.max_guests || 1) >= filterGuests
    const statusOk = !r.status || r.status.toLowerCase() === 'available' || r.available === true
    return okCapacity && statusOk
  }

  return (
    <main className={styles.container} style={{ padding: 20 }}>
      <header className={styles.header}>
        <h1>Guest Portal</h1>
        <p>Browse rooms, make bookings, and view your booking history.</p>
      </header>

      <section style={{ marginTop: 12, marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Guests:
          <input type="number" min="1" value={filterGuests} onChange={e => setFilterGuests(Number(e.target.value || 1))} style={{ marginLeft: 8, width: 80 }} />
        </label>
        <button onClick={fetchRooms} style={{ marginLeft: 8 }}>Refresh</button>
      </section>

      {loading && <div>Loading rooms…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <ul className={styles.roomsList}>
        {rooms.filter(available).map(room => (
          <li key={room.id || room._id} className={styles.roomItem}>
            <div>
              <strong>{room.room_type || room.name}</strong>
              <div style={{ marginTop: 6 }}>{room.description || room.notes || ''}</div>
              <div style={{ marginTop: 6 }}>${room.price || room.rate || '—'}/night • Capacity: {room.capacity || room.max_guests || 1}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openBooking(room)} style={{ background: '#0070f3', color: '#fff' }}>Book</button>
            </div>
          </li>
        ))}
      </ul>

      <BookingModal open={isModalOpen} room={selectedRoom} onClose={() => setIsModalOpen(false)} onBooked={handleBooked} />
    </main>
  )
}
