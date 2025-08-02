import React from 'react';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import { Plus, Building, Users } from 'lucide-react';

const Rooms: React.FC = () => {
  const { data: rooms, isLoading } = useQuery('rooms', async () => {
    const response = await api.get('/rooms');
    return response.data;
  });

  const { data: roomTypes } = useQuery('roomTypes', async () => {
    const response = await api.get('/rooms/types');
    return response.data;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600">Manage hotel rooms and room types</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </div>

      {/* Room Types */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Room Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roomTypes?.data?.map((type: any) => (
            <div key={type.id} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{type.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">${type.base_price}</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {type.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms Table */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">All Rooms</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms?.data?.map((room: any) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {room.room_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.room_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.floor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${room.base_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rooms; 