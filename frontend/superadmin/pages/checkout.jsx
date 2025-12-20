import React, { useState } from 'react'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE || '')

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('100.00');
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const intentRes = await axios.post((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/payments/intent', { amount });
      const clientSecret = intentRes.data.clientSecret;

      const card = elements.getElement(CardElement);
      const confirm = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });
      if (confirm.error) {
        toast.error('Payment failed: ' + confirm.error.message);
        setLoading(false);
        return;
      }

      // record payment server-side
      await axios.post((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + '/api/payments', { bookingId, amount, method: 'card', stripePaymentIntentId: confirm.paymentIntent?.id });
      toast.success('Payment successful');
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Payment error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} style={{ padding: 24 }}>
      <h2>Checkout (Stripe Elements)</h2>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="checkout-bookingId">Booking ID</label><br/>
        <input id="checkout-bookingId" value={bookingId} onChange={e=>setBookingId(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="checkout-amount">Amount</label><br/>
        <input id="checkout-amount" value={amount} onChange={e=>setAmount(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe || loading}>{loading ? 'Processing...' : 'Pay'}</button>
    </form>
  )
}

export default function CheckoutPage() {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE) {
    return <div style={{ padding: 24 }}>Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE` to enable Stripe Elements (demo fallback still works).</div>
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
