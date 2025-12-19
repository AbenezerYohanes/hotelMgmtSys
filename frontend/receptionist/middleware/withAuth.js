import Router from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component){
  return function Protected(props){
    useEffect(()=>{
      const token = typeof window !== 'undefined' && localStorage.getItem('reception_token');
      if (!token) Router.push('/login');
    },[]);
    return <Component {...props} />;
  };
}
