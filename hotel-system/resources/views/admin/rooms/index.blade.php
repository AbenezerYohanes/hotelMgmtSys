@extends('layouts.app')

@section('title', 'Rooms')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Rooms</h1>
            <p class="text-muted mb-0">Manage room inventory and availability.</p>
        </div>
        <a class="btn btn-primary" href="{{ route('admin.rooms.create') }}">Add room</a>
    </div>

    <form method="GET" class="row g-2 mb-3">
        <div class="col-sm-3">
            <x-form.select
                name="active"
                label="Active"
                :options="['all' => 'All', 'active' => 'Active', 'inactive' => 'Inactive']"
                :selected="$active"
            />
        </div>
        <div class="col-sm-3">
            <x-form.select
                name="room_type_id"
                label="Room type"
                :options="$roomTypes->pluck('name', 'id')->all()"
                :selected="$roomTypeId"
                placeholder="All types"
            />
        </div>
        <div class="col-sm-3">
            <x-form.select
                name="status"
                label="Status"
                :options="collect($statuses)->mapWithKeys(fn ($status) => [$status => ucfirst(str_replace('_', ' ', $status))])->all()"
                :selected="$status"
                placeholder="All statuses"
            />
        </div>
        <div class="col-sm-3 d-flex align-items-end gap-2">
            <button class="btn btn-outline-primary w-100" type="submit">Filter</button>
            <a class="btn btn-outline-secondary w-100" href="{{ route('admin.rooms.index') }}">Reset</a>
        </div>
    </form>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Floor</th>
                        <th>Status</th>
                        <th>Active</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($rooms as $room)
                        <tr>
                            <td class="fw-semibold">{{ $room->room_number }}</td>
                            <td>{{ $room->roomType?->name }}</td>
                            <td>{{ $room->floor }}</td>
                            <td>
                                <span class="badge bg-{{ $room->status === 'clean' ? 'success' : ($room->status === 'dirty' ? 'warning' : 'secondary') }}">
                                    {{ ucfirst(str_replace('_', ' ', $room->status)) }}
                                </span>
                            </td>
                            <td>
                                <span class="badge {{ $room->is_active ? 'bg-success' : 'bg-secondary' }}">
                                    {{ $room->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex gap-2">
                                    <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.rooms.edit', $room) }}">Edit</a>
                                    <form method="POST" action="{{ route('admin.rooms.destroy', $room) }}" onsubmit="return confirm('Delete this room?');">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No rooms found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-3">
        {{ $rooms->links() }}
    </div>
@endsection
