@extends('layouts.app')

@section('title', 'Housekeeping Assignments')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Housekeeping assignments</h1>
            <p class="text-muted mb-0">Assign rooms to housekeepers by date.</p>
        </div>
        @can('housekeeping.view')
            <a class="btn btn-outline-secondary" href="{{ route('housekeeping.dashboard') }}">My assignments</a>
        @endcan
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('housekeeping.assignments.index') }}" class="row g-3 align-items-end">
                <div class="col-md-4">
                    <x-form.input
                        name="assigned_date"
                        type="date"
                        label="Assignment date"
                        :value="$assignedDate"
                        required
                    />
                </div>
                <div class="col-md-4">
                    <button class="btn btn-outline-primary" type="submit">Filter</button>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h2 class="h6 mb-3">Create assignment</h2>
            <form method="POST" action="{{ route('housekeeping.assignments.store') }}" class="row g-3">
                @csrf
                <div class="col-md-5">
                    <x-form.select
                        name="room_id"
                        label="Room"
                        :options="$rooms->mapWithKeys(fn ($room) => [$room->id => $room->room_number.' - '.$room->roomType?->name])->all()"
                        placeholder="Select a room"
                        required
                    />
                </div>
                <div class="col-md-5">
                    <x-form.select
                        name="housekeeper_user_id"
                        label="Housekeeper"
                        :options="$housekeepers->mapWithKeys(fn ($user) => [$user->id => $user->name.' ('.$user->email.')'])->all()"
                        placeholder="Select a housekeeper"
                        required
                    />
                </div>
                <div class="col-md-2">
                    <x-form.input
                        name="assigned_date"
                        type="date"
                        label="Date"
                        :value="$assignedDate"
                        required
                    />
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" type="submit">Assign room</button>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow-sm ihms-table-card">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h6 mb-0">Assignments for {{ $assignedDate }}</h2>
                <span class="badge bg-info text-dark">
                    {{ $assignments->count() }} assignment{{ $assignments->count() === 1 ? '' : 's' }}
                </span>
            </div>
            @if ($assignments->isEmpty())
                <p class="text-muted mb-0">No rooms assigned for this date.</p>
            @else
                <div class="table-responsive">
                    <table class="table table-striped align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Room</th>
                                <th>Type</th>
                                <th>Housekeeper</th>
                                <th>Status</th>
                                <th>Room status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($assignments as $assignment)
                                @php
                                    $roomStatus = $assignment->room?->status ?? 'unknown';
                                    $roomBadge = match ($roomStatus) {
                                        'dirty' => 'bg-warning text-dark',
                                        'out_of_service' => 'bg-secondary',
                                        'clean' => 'bg-success',
                                        default => 'bg-secondary',
                                    };
                                    $assignmentBadge = $assignment->status === 'done' ? 'bg-success' : 'bg-info text-dark';
                                @endphp
                                <tr>
                                    <td class="fw-semibold">{{ $assignment->room?->room_number ?? 'N/A' }}</td>
                                    <td>{{ $assignment->room?->roomType?->name ?? 'N/A' }}</td>
                                    <td>
                                        {{ $assignment->housekeeper?->name ?? 'N/A' }}
                                        <div class="text-muted small">{{ $assignment->housekeeper?->email ?? '' }}</div>
                                    </td>
                                    <td>
                                        <span class="badge {{ $assignmentBadge }}">{{ ucfirst($assignment->status) }}</span>
                                    </td>
                                    <td>
                                        <span class="badge {{ $roomBadge }}">{{ ucfirst(str_replace('_', ' ', $roomStatus)) }}</span>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    </div>
@endsection
