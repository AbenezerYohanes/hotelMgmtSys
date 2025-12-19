import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { get } from '../../services/api';
import { useState } from 'react';

function Payments(){
  const [list, setList] = useState([]);
  async function load(){
    const res = await get('/payments');
    setList(res.data || []);
  }
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Payments</h2>
        <button onClick={load}>Load</button>
        <ul>{list.map(p=> <li key={p.id}>{p.amount} - {p.method}</li>)}</ul>
      </div>
    </div>
  );
}
export default withAuth(Payments);
