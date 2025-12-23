import React, { useEffect, useState } from "react";
import BookingModal from "../components/BookingModal";
import { apiService } from "../utils/apiService";
import styles from "../styles/Home.module.css";

export default function GuestHome() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterGuests, setFilterGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await apiService.getRooms();
      setRooms(res.data.rooms || res.data || []);
    } catch (err) {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const available = (r) => {
    const okCapacity = (r.capacity || 1) >= filterGuests;
    const statusOk = r.status === "available" || !r.status;
    const searchOk = !searchTerm || (r.room_type || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const typeOk = roomTypeFilter === 'All' || (r.room_type || '').toLowerCase() === roomTypeFilter.toLowerCase();
    const price = r.price || 0;
    const minPriceOk = !minPrice || price >= Number(minPrice);
    const maxPriceOk = !maxPrice || price <= Number(maxPrice);
    return okCapacity && statusOk && searchOk && typeOk && minPriceOk && maxPriceOk;
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo">🏨 Heaven Hotel</div>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to Heaven Hotel</h1>
        <p>Comfort • Luxury • Peace</p>
      </section>

      {/* FILTER */}
      <section className="filter">
        <label>
          Guests:
          <input
            type="number"
            min="1"
            value={filterGuests}
            onChange={(e) => setFilterGuests(Number(e.target.value))}
          />
        </label>
        <button onClick={fetchRooms}>Refresh</button>
      </section>

      {/* ROOMS */}
      <main className="container">
        {loading && <p>Loading rooms...</p>}
        {error && <p className="error">{error}</p>}

        <ul className="rooms-list">
          {rooms.filter(available).map((room) => (
            <li key={room.id} className="room-card">
              <h3>{room.room_type}</h3>
              <p>{room.description}</p>
              <p>
                <strong>${room.price}</strong> / night
              </p>
              <p>Capacity: {room.capacity}</p>
              <button onClick={() => openBooking(room)}>Book Now</button>
            </li>
          ))}
        </ul>
      </main>

      {/* MODAL */}
      <BookingModal
        open={isModalOpen}
        room={selectedRoom}
        onClose={() => setIsModalOpen(false)}
        onBooked={fetchRooms}
      />

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Heaven Hotel</p>
      </footer>
    </div>
  );
}
