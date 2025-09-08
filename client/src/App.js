import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import ClientHome from './pages/ClientHome';
import ClientBooking from './pages/ClientBooking';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Bookings from './pages/Bookings';
import Rooms from './pages/Rooms';
import Guests from './pages/Guests';
import HR from './pages/HR';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Users from './pages/Users';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" />;
  const isAdmin = ['admin', 'manager', 'staff'].includes(user?.role);
  return isAdmin ? <>{children}</> : <Navigate to="/client" />;
};

const ClientRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" />;
  const isClient = !['admin', 'manager', 'staff'].includes(user?.role);
  return isClient ? <>{children}</> : <Navigate to="/admin" />;
};

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="guests" element={<Guests />} />
            <Route path="hr" element={<HR />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route
            path="/client"
            element={
              <ClientRoute>
                <ClientHome />
              </ClientRoute>
            }
          />
          <Route
            path="/client/book"
            element={
              <ClientRoute>
                <ClientBooking />
              </ClientRoute>
            }
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
};

export default App;
