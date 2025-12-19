import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

export default function Dashboard() {
  const { user, api } = useAuth();
  const [data, setData] = useState({ bookings: [], rooms: [], notifications: [], schedule: [] });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [bookingsRes, roomsRes, notesRes, schRes] = await Promise.all([
          api.get('/bookings/assigned'),
          api.get('/rooms'),
          api.get('/notifications'),
          api.get('/schedules')
        ]);
        if (!mounted) return;
        setData({ bookings: bookingsRes, rooms: roomsRes.rooms || [], notifications: notesRes, schedule: schRes });
      } catch (err) { console.error(err); }
    }
    load();
    return () => { mounted = false };
  }, [api]);

  return (
    <div className="container">
      <h1>Welcome, {user?.name}</h1>
      <section className="panel">
        <h3>Assigned Bookings</h3>
        <ul>{data.bookings.map(b => <li key={b.id}>{b.reference} - {b.guestName} ({b.status})</li>)}</ul>
      </section>
      <section className="panel">
        <h3>Rooms Overview</h3>
        <ul>{data.rooms.map(r => <li key={r.id}>{r.number || r.name} - {r.status}</li>)}</ul>
      </section>
      <section className="panel">
        <h3>Notifications</h3>
        <ul>{data.notifications.map(n => <li key={n.id}>{n.message} - {n.priority}</li>)}</ul>
      </section>
    </div>
  )
}
