import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { get, post } from '../../services/api';
import { useState } from 'react';

function Rooms(){
  const [rooms, setRooms] = useState([]);
  async function load(){
    const res = await get('/rooms');
    setRooms(res.data || []);
  }
  async function setStatus(id, status){
    await post(`/rooms/${id}/status`, { status });
    load();
  }
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Rooms</h2>
        <button onClick={load}>Load</button>
        <ul>{rooms.map(r=> <li key={r.id}>{r.number} - {r.status} <button onClick={()=>setStatus(r.id,'available')}>Available</button></li>)}</ul>
      </div>
    </div>
  );
}
export default withAuth(Rooms);
