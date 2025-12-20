import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Hotels from './pages/Hotels';
import Roles from './pages/Roles';
import Employees from './pages/Employees';
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
          <Route path="/hotels" element={<PrivateRoute><Hotels /></PrivateRoute>} />
          <Route path="/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

