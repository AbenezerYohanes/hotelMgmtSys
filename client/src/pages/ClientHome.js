import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const ClientHome = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
      <p className="mt-2 text-gray-600">Book your stay and manage your reservations.</p>
      <div className="mt-6">
        <Link
          to="/client/book"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          <Calendar className="mr-2 h-5 w-5" /> Book a room
        </Link>
      </div>
    </div>
  );
};

export default ClientHome;


