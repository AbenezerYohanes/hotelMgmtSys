import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        axios.get('/api/v1/rooms').then(r => setRooms(r.data.rooms || []));
    }, []);
    return (
        <main style={{ padding: 20 }}>
            <h1>Rooms</h1>
            <ul>
                {rooms.map(room => (
                    <li key={room.id}>{room.room_type} — ${room.price}</li>
                ))}
            </ul>
        </main>
    );
}
