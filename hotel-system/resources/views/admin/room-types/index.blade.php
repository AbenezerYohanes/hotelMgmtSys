@extends('layouts.app')

@section('title', 'Room Types')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Room Types</h1>
            <p class="text-muted mb-0">Manage pricing and occupancy definitions.</p>
        </div>
        <a class="btn btn-primary" href="{{ route('admin.room-types.create') }}">Add room type</a>
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
        <div class="col-sm-3 align-self-end">
            <button class="btn btn-outline-primary w-100" type="submit">Filter</button>
        </div>
        <div class="col-sm-3 align-self-end">
            <a class="btn btn-outline-secondary w-100" href="{{ route('admin.room-types.index') }}">Reset</a>
        </div>
    </form>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Name</th>
                        <th>Price / Night</th>
                        <th>Max Occupancy</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($roomTypes as $roomType)
                        <tr>
                            <td class="fw-semibold">{{ $roomType->name }}</td>
                            <td>{{ number_format($roomType->price_per_night, 2) }}</td>
                            <td>{{ $roomType->max_occupancy }}</td>
                            <td>
                                <span class="badge {{ $roomType->is_active ? 'bg-success' : 'bg-secondary' }}">
                                    {{ $roomType->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex gap-2">
                                    <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.room-types.edit', $roomType) }}">Edit</a>
                                    <form method="POST" action="{{ route('admin.room-types.toggle', $roomType) }}">
                                        @csrf
                                        @method('PATCH')
                                        <button class="btn btn-sm btn-outline-warning" type="submit">
                                            {{ $roomType->is_active ? 'Deactivate' : 'Activate' }}
                                        </button>
                                    </form>
                                    <form method="POST" action="{{ route('admin.room-types.destroy', $roomType) }}" onsubmit="return confirm('Delete this room type?');">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted py-4">No room types found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-3">
        {{ $roomTypes->links() }}
    </div>
@endsection
