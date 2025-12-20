import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Reservations from './pages/Reservations';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
import Billing from './pages/Billing';
import Rooms from './pages/Rooms';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/guests" element={<PrivateRoute><Guests /></PrivateRoute>} />
          <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
          <Route path="/checkin" element={<PrivateRoute><CheckIn /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckOut /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

