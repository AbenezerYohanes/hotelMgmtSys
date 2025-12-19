import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { get, post } from '../../services/api';
import { useState } from 'react';

function Bookings() {
  const [list, setList] = useState([]);
  async function load(){
    const res = await get('/bookings');
    setList(res.data || []);
  }
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Bookings</h2>
        <button onClick={load}>Load</button>
        <ul>
          {list.map(b=> <li key={b.id}>{b.reference} - {b.status}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(Bookings);
