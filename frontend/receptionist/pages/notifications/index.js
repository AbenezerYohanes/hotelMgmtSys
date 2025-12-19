import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import useSWR from 'swr';
import { get } from '../../services/api';

function Notifications(){
  const { data } = useSWR('/notifications', url => get(url));
  const list = data ? data.data : [];
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Notifications</h2>
        <ul>{list.map(n=> <li key={n.id}>{n.message}</li>)}</ul>
      </div>
    </div>
  );
}
export default withAuth(Notifications);
