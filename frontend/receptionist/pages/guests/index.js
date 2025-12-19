import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { get, post } from '../../services/api';
import { useState } from 'react';

function Guests(){
  const [list, setList] = useState([]);
  const [guest, setGuest] = useState({ firstName:'', lastName:'' });
  async function load(){
    const res = await get('/guests');
    setList(res.data || []);
  }
  async function create(){
    await post('/guests', guest);
    load();
  }
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Guests</h2>
        <button onClick={load}>Load</button>
        <ul>{list.map(g=> <li key={g.id}>{g.firstName} {g.lastName}</li>)}</ul>
        <div>
          <input placeholder="First name" value={guest.firstName} onChange={e=>setGuest({...guest, firstName:e.target.value})} />
          <input placeholder="Last name" value={guest.lastName} onChange={e=>setGuest({...guest, lastName:e.target.value})} />
          <button onClick={create}>Create</button>
        </div>
      </div>
    </div>
  );
}
export default withAuth(Guests);
