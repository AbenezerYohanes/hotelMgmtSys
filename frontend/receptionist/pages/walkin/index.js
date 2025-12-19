import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { post } from '../../services/api';
import { useState } from 'react';

function Walkin(){
  const [guest, setGuest] = useState({ firstName:'', lastName:'' });
  const [roomId, setRoomId] = useState('');
  async function create(){
    // create booking as walk-in
    const res = await post('/bookings', { guest, roomId, checkInDate: new Date(), checkOutDate: new Date(Date.now()+86400000) });
    alert(res.success ? 'Walk-in created' : 'Failed');
  }
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Walk-in</h2>
        <input placeholder="First" value={guest.firstName} onChange={e=>setGuest({...guest, firstName:e.target.value})} />
        <input placeholder="Last" value={guest.lastName} onChange={e=>setGuest({...guest, lastName:e.target.value})} />
        <input placeholder="Room ID" value={roomId} onChange={e=>setRoomId(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>
    </div>
  );
}
export default withAuth(Walkin);
