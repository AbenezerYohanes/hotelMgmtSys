import React, { useState } from 'react'
import axios from 'axios'

export default function PaymentPage() {
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('100.00');
  const [msg, setMsg] = useState('');

  const createIntent = async () => {
    try {
      const res = await axios.post((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/payments/intent', { amount });
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const payNow = async (e) => {
    e.preventDefault();
    setMsg('Processing...');
    const intent = await createIntent();
    // In a real app you'd send the client secret to Stripe.js to confirm card.
    // Here we simulate completion by posting to /api/payments
    const res = await axios.post((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/payments', { bookingId, amount, method: 'card', stripePaymentIntentId: intent?.id });
    setMsg('Payment recorded: ' + JSON.stringify(res.data));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Payment (demo)</h2>
      <form onSubmit={payNow}>
        <div>
          <label htmlFor="payment-bookingId">Booking ID</label>
          <input id="payment-bookingId" value={bookingId} onChange={e => setBookingId(e.target.value)} />
        </div>
        <div>
          <label htmlFor="payment-amount">Amount</label>
          <input id="payment-amount" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <button type="submit">Pay</button>
      </form>
      <p>{msg}</p>
    </div>
  )
}
