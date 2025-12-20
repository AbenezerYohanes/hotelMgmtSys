import React from 'react';
import Link from 'next/link';

export default function Home() {
    return (
        <main style={{ padding: 20 }}>
            <h1>Welcome to the Hotel</h1>
            <p>Browse rooms and make bookings.</p>
            <Link href="/rooms">View Rooms</Link>
        </main>
    );
}
