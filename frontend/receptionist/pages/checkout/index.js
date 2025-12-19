import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { post } from '../../services/api';
import { useState } from 'react';

function Checkout(){
  const [bookingId, setBookingId] = useState('');
  const [payments, setPayments] = useState([]);
  const [msg, setMsg] = useState(null);

  async function handle(){
    const res = await post('/checkout', { bookingId, payments });
    setMsg(res.success ? 'Checked out' : 'Failed');
  }

  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Check-Out</h2>
        <input placeholder="Booking ID" value={bookingId} onChange={e=>setBookingId(e.target.value)} />
        <button onClick={handle}>Process Checkout</button>
        {msg && <div>{msg}</div>}
      </div>
    </div>
  );
}
export default withAuth(Checkout);
