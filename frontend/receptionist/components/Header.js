import Router from 'next/router';

export default function Header(){
  const logout = ()=>{
    localStorage.removeItem('reception_token');
    localStorage.removeItem('reception_user');
    Router.push('/login');
  };
  return (
    <header style={{display:'flex',justifyContent:'space-between',padding:10,background:'#eee'}}>
      <div>Receptionist</div>
      <div>
        <button onClick={()=>Router.push('/dashboard')}>Dashboard</button>
        <button onClick={()=>Router.push('/bookings')}>Bookings</button>
        <button onClick={()=>Router.push('/checkin')}>Check-in</button>
        <button onClick={()=>Router.push('/checkout')}>Check-out</button>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
