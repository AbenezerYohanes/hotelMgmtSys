import useSWR from 'swr';
import { get } from '../services/api';
import withAuth from '../middleware/withAuth';
import Header from '../components/Header';

function Dashboard() {
  const { data: bookings } = useSWR('/bookings', url => get(url));
  const { data: rooms } = useSWR('/rooms', url => get(url));

  return (
    <div>
      <Header />
      <main style={{padding:20}}>
        <h1>Dashboard</h1>
        <section>
          <h3>Today</h3>
          <div>Bookings: {bookings ? bookings.data.length : '...'}</div>
          <div>Rooms: {rooms ? rooms.data.length : '...'}</div>
        </section>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
