import React from 'react';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  Building,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: bookingStats } = useQuery('bookingStats', async () => {
    const response = await api.get('/bookings/dashboard/stats');
    return response.data.data;
  });

  const { data: roomStats } = useQuery('roomStats', async () => {
    const response = await api.get('/rooms/dashboard/stats');
    return response.data.data;
  });

  const { data: paymentStats } = useQuery('paymentStats', async () => {
    const response = await api.get('/payments/dashboard/stats');
    return response.data.data;
  });

  const { data: hrStats } = useQuery('hrStats', async () => {
    const response = await api.get('/hr/dashboard');
    return response.data.data;
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const stats = [
    {
      name: 'Total Bookings',
      value: bookingStats?.monthBookings || 0,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'Monthly Revenue',
      value: `$${paymentStats?.monthPayments?.total?.toLocaleString() || 0}`,
      icon: CreditCard,
      color: 'bg-green-500',
    },
    {
      name: 'Occupancy Rate',
      value: `${roomStats?.occupancyRate || 0}%`,
      icon: Building,
      color: 'bg-purple-500',
    },
    {
      name: 'Active Employees',
      value: hrStats?.totalEmployees || 0,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your hotel management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStats?.paymentsByMethod || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="payment_method" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Room Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roomStats?.roomsByType || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(roomStats?.roomsByType || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {bookingStats?.recentBookings?.slice(0, 5).map((booking: any) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Booking #{booking.booking_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.first_name} {booking.last_name} - Room {booking.room_number}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${booking.total_amount}</p>
                <p className="text-sm text-gray-600">{booking.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 