import withAuth from '../../middleware/withAuth';
import Header from '../../components/Header';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';

function Profile(){
  const [profile, setProfile] = useState(null);
  useEffect(()=>{
    setProfile(JSON.parse(localStorage.getItem('reception_user')) || null);
  },[]);
  return (
    <div>
      <Header />
      <div style={{padding:20}}>
        <h2>Profile</h2>
        {profile && <div>{profile.name} - {profile.email}</div>}
      </div>
    </div>
  );
}
export default withAuth(Profile);
