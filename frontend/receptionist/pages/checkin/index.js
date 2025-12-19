import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { post } from '../../services/api';
import { useState } from 'react';

function Checkin(){
  const [bookingId, setBookingId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [msg, setMsg] = useState(null);
  async function handle(){
    const res = await post('/checkin', { bookingId, roomId });
    setMsg(res.success ? 'Checked in' : 'Failed');
  }
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Check-In</h2>
        <input placeholder="Booking ID" value={bookingId} onChange={e=>setBookingId(e.target.value)} />
        <input placeholder="Room ID" value={roomId} onChange={e=>setRoomId(e.target.value)} />
        <button onClick={handle}>Check In</button>
        {msg && <div>{msg}</div>}
      </div>
    </div>
  );
}
export default withAuth(Checkin);
