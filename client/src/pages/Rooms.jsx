import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { roomsService } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const Rooms = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await roomsService.getRooms();
      return res?.data || res;
    },
  });

  const queryClient = useQueryClient();
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const { user } = useAuth();
  const canManage = ['super_admin', 'admin', 'manager'].includes(user?.role);

  const roomSchema = z.object({
    room_number: z.string().min(1, 'Room number is required'),
    room_type: z.string().min(1, 'Room type is required'),
    floor: z.string().optional(),
    status: z.enum(['available', 'occupied', 'maintenance']).default('available'),
    price: z.preprocess((v) => Number(v), z.number().nonnegative())
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: { room_number: '', room_type: '', floor: '', status: 'available', price: '' }
  });

  const openCreate = () => {
    setEditingRoom(null);
    reset({ room_number: '', room_type: '', floor: '', status: 'available', price: '' });
    setShowRoomForm(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room.id);
    reset({
      room_number: room.room_number || '',
      room_type: room.room_type || room.room_type_id || '',
      floor: room.floor || '',
      status: room.status || 'available',
      price: room.price || ''
    });
    setShowRoomForm(true);
  };

  const handleRoomSubmit = async (data) => {
    try {
      if (editingRoom) {
        await roomsService.updateRoom(editingRoom, data);
        toast.success('Room updated');
      } else {
        await roomsService.createRoom(data);
        toast.success('Room created');
      }
      setShowRoomForm(false);
      queryClient.invalidateQueries(['rooms']);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save room';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await roomsService.deleteRoom(id);
      toast.success('Room deleted');
      queryClient.invalidateQueries(['rooms']);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete room';
      toast.error(msg);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
      <p className="mt-1 text-sm text-gray-500">Manage hotel rooms and availability</p>
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex justify-end mb-4">
          {canManage && (
            <button onClick={openCreate} className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">+ Add Room</button>
          )}
        </div>
        {isLoading && <div className="text-gray-500">Loading rooms...</div>}
        {isError && <div className="text-red-600">Failed to load rooms: {error.message}</div>}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.data || data || []).map((room) => (
              <div key={room.id} className="rounded-lg border p-4">
                <div className="text-sm text-gray-500">Room</div>
                <div className="text-xl font-semibold text-gray-900">{room.room_number}</div>
                <div className="mt-2 text-gray-600">Type: {room.room_type || room.room_type_id}</div>
                <div className="mt-1 text-gray-600">Floor: {room.floor}</div>
                <div className="mt-1 text-gray-600">Status: {room.status}</div>
                {canManage && (
                  <div className="mt-3 flex space-x-2">
                    <button onClick={() => openEdit(room)} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</button>
                    <button onClick={() => handleDelete(room.id)} className="px-2 py-1 bg-red-100 text-red-800 rounded">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showRoomForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center p-4 z-50">
          <div className="bg-white rounded shadow p-6 w-full max-w-md mt-12">
            <h3 className="text-lg font-medium mb-4">{editingRoom ? 'Edit Room' : 'Create Room'}</h3>
            <form onSubmit={handleSubmit(handleRoomSubmit)} className="space-y-3">
              <div>
                <input {...register('room_number')} className="w-full border rounded px-3 py-2" placeholder="Room Number" />
                {errors.room_number && <div className="text-red-600 text-sm">{errors.room_number.message}</div>}
              </div>
              <div>
                <input {...register('room_type')} className="w-full border rounded px-3 py-2" placeholder="Room Type" />
                {errors.room_type && <div className="text-red-600 text-sm">{errors.room_type.message}</div>}
              </div>
              <div>
                <input {...register('floor')} className="w-full border rounded px-3 py-2" placeholder="Floor" />
              </div>
              <div>
                <input {...register('price')} type="number" className="w-full border rounded px-3 py-2" placeholder="Price" />
                {errors.price && <div className="text-red-600 text-sm">{errors.price.message}</div>}
              </div>
              <div>
                <select {...register('status')} className="w-full border rounded px-3 py-2">
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Save</button>
                <button type="button" onClick={() => setShowRoomForm(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
