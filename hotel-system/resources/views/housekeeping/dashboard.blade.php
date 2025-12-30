@extends('layouts.app')

@section('title', 'Housekeeping')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">{{ $isAdmin ? 'Housekeeping assignments' : 'My assigned rooms' }}</h1>
            <p class="text-muted mb-0">Assignments for {{ $today->format('M d, Y') }}</p>
        </div>
        <span class="badge bg-info text-dark">Open issues: {{ $openIssuesCount }}</span>
    </div>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Floor</th>
                        @if ($isAdmin)
                            <th>Housekeeper</th>
                        @endif
                        <th>Room status</th>
                        <th>Assignment status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($assignments as $assignment)
                        @php
                            $room = $assignment->room;
                            $housekeeper = $assignment->housekeeper;
                            $roomStatus = $room?->status ?? 'unknown';
                            $roomBadge = match ($roomStatus) {
                                'dirty' => 'bg-warning text-dark',
                                'out_of_service' => 'bg-secondary',
                                'clean' => 'bg-success',
                                default => 'bg-secondary',
                            };
                            $assignmentBadge = $assignment->status === 'done' ? 'bg-success' : 'bg-info text-dark';
                        @endphp
                        <tr>
                            <td class="fw-semibold">{{ $room?->room_number ?? 'N/A' }}</td>
                            <td>{{ $room?->roomType?->name ?? 'N/A' }}</td>
                            <td>{{ $room?->floor ?? 'N/A' }}</td>
                            @if ($isAdmin)
                                <td>{{ $housekeeper?->name ?? 'Unassigned' }}</td>
                            @endif
                            <td>
                                <span class="badge {{ $roomBadge }}">
                                    {{ ucfirst(str_replace('_', ' ', $roomStatus)) }}
                                </span>
                            </td>
                            <td>
                                <span class="badge {{ $assignmentBadge }}">
                                    {{ ucfirst($assignment->status) }}
                                </span>
                            </td>
                            <td class="text-end">
                                @can('housekeeping.manage')
                                    <div class="d-inline-flex flex-wrap gap-2">
                                        <form method="POST" action="{{ route('housekeeping.assignments.status', $assignment) }}">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="room_status" value="clean">
                                            <button
                                                class="btn btn-sm btn-outline-success"
                                                type="submit"
                                                @if ($roomStatus === 'clean' || $roomStatus === 'out_of_service') disabled @endif
                                            >
                                                Mark clean
                                            </button>
                                        </form>
                                        <form method="POST" action="{{ route('housekeeping.assignments.status', $assignment) }}">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="room_status" value="dirty">
                                            <button
                                                class="btn btn-sm btn-outline-warning"
                                                type="submit"
                                                @if ($roomStatus === 'dirty' || $roomStatus === 'out_of_service') disabled @endif
                                            >
                                                Mark dirty
                                            </button>
                                        </form>
                                    </div>
                                @else
                                    <span class="text-muted small">No actions available.</span>
                                @endcan
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="{{ $isAdmin ? 7 : 6 }}" class="text-center text-muted py-4">
                                No rooms assigned for today.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
