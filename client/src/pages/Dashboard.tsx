import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Bed,
  Clock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/api';

interface DashboardStats {
  totalGuests: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageStay: number;
  monthlyRevenue: number;
  monthlyBookings: number;
}

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: reportService.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalGuests: 1247,
    totalRooms: 85,
    totalBookings: 156,
    totalRevenue: 125000,
    occupancyRate: 78.5,
    averageStay: 3.2,
    monthlyRevenue: 45000,
    monthlyBookings: 89,
  };

  const currentStats = stats || mockStats;

  const statCards = [
    {
      name: 'Total Guests',
      value: currentStats.totalGuests.toLocaleString(),
      icon: Users,
      change: '+12%',
      changeType: 'increase',
      color: 'blue',
    },
    {
      name: 'Total Rooms',
      value: currentStats.totalRooms,
      icon: Building2,
      change: '+2',
      changeType: 'increase',
      color: 'green',
    },
    {
      name: 'Active Bookings',
      value: currentStats.totalBookings,
      icon: Calendar,
      change: '+8%',
      changeType: 'increase',
      color: 'purple',
    },
    {
      name: 'Total Revenue',
      value: `$${currentStats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      change: '+15%',
      changeType: 'increase',
      color: 'yellow',
    },
  ];

  const quickActions = [
    { name: 'New Booking', icon: Calendar, href: '/bookings', color: 'blue' },
    { name: 'Add Guest', icon: Users, href: '/guests', color: 'green' },
    { name: 'Room Status', icon: Building2, href: '/rooms', color: 'purple' },
    { name: 'Payment', icon: CreditCard, href: '/payments', color: 'yellow' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Failed to load dashboard data</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back! Here's what's happening with your hotel today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className={`h-6 w-6 text-${stat.color}-600`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="flex items-center">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span
                    className={`ml-2 font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-2 text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Occupancy Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Room Occupancy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Occupancy</span>
              <span className="text-2xl font-bold text-blue-600">
                {currentStats.occupancyRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${currentStats.occupancyRate}%` }}
              ></div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Bed className="h-4 w-4 mr-1" />
              {Math.round((currentStats.occupancyRate / 100) * currentStats.totalRooms)} rooms occupied
            </div>
          </div>
        </motion.div>

        {/* Revenue Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Monthly Revenue</span>
              <span className="text-2xl font-bold text-green-600">
                ${currentStats.monthlyRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Revenue</span>
              <span className="text-lg font-semibold text-gray-900">
                ${currentStats.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="h-4 w-4 mr-1" />
              Average per booking: ${Math.round(currentStats.totalRevenue / currentStats.totalBookings)}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={() => window.location.href = action.href}
              className="group relative bg-gray-50 p-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <action.icon
                  className={`h-8 w-8 text-${action.color}-600 mb-2 group-hover:scale-110 transition-transform`}
                />
                <span className="text-sm font-medium text-gray-900">
                  {action.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New booking confirmed', time: '2 minutes ago', type: 'booking' },
            { action: 'Guest checked in', time: '15 minutes ago', type: 'checkin' },
            { action: 'Payment received', time: '1 hour ago', type: 'payment' },
            { action: 'Room cleaned', time: '2 hours ago', type: 'maintenance' },
            { action: 'New guest registered', time: '3 hours ago', type: 'guest' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <div className="flex-shrink-0">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 