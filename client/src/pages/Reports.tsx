import React from 'react';
import { BarChart3 } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">View detailed reports and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Revenue Report</h3>
              <p className="text-sm text-gray-600">Monthly and yearly revenue analysis</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Occupancy Report</h3>
              <p className="text-sm text-gray-600">Room occupancy and utilization rates</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Booking Report</h3>
              <p className="text-sm text-gray-600">Booking trends and patterns</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Guest Report</h3>
              <p className="text-sm text-gray-600">Guest demographics and preferences</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Employee Report</h3>
              <p className="text-sm text-gray-600">Employee performance and statistics</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Payment Report</h3>
              <p className="text-sm text-gray-600">Payment methods and transaction analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 