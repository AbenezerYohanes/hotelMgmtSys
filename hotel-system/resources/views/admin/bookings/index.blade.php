@extends('layouts.app')

@section('title', 'Bookings')

@section('content')
    @php
        $statusBadges = [
            'pending' => 'bg-warning text-dark',
            'confirmed' => 'bg-primary',
            'checked_in' => 'bg-success',
            'checked_out' => 'bg-secondary',
            'cancelled' => 'bg-danger',
        ];
    @endphp

    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Bookings</h1>
            <p class="text-muted mb-0">Review and filter reservations across the property.</p>
        </div>
        <a class="btn btn-outline-secondary" href="{{ route('admin.dashboard') }}">Back to admin</a>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('admin.bookings.index') }}" class="row g-3 align-items-end">
                <div class="col-md-3">
                    <x-form.input
                        name="booking_code"
                        label="Booking code"
                        :value="$bookingCode"
                        placeholder="HEAVEN-2025-00001"
                    />
                </div>
                <div class="col-md-3">
                    <x-form.input
                        name="guest"
                        label="Guest"
                        :value="$guest"
                        placeholder="Name or email"
                    />
                </div>
                <div class="col-md-2">
                    <x-form.input
                        name="room_number"
                        label="Room"
                        :value="$roomNumber"
                        placeholder="101"
                    />
                </div>
                <div class="col-md-2">
                    <x-form.select
                        name="room_type_id"
                        label="Room type"
                        :options="$roomTypes->pluck('name', 'id')->all()"
                        :selected="$roomTypeId"
                        placeholder="All types"
                    />
                </div>
                <div class="col-md-2">
                    <x-form.select
                        name="status"
                        label="Status"
                        :options="$statusOptions"
                        :selected="$status"
                        placeholder="All statuses"
                    />
                </div>
                <div class="col-md-2">
                    <x-form.input
                        name="check_in_from"
                        type="date"
                        label="Check-in from"
                        :value="$checkInFrom"
                    />
                </div>
                <div class="col-md-2">
                    <x-form.input
                        name="check_in_to"
                        type="date"
                        label="Check-in to"
                        :value="$checkInTo"
                    />
                </div>
                <div class="col-md-2 d-flex gap-2">
                    <button class="btn btn-outline-primary" type="submit">Filter</button>
                    <a class="btn btn-outline-secondary" href="{{ route('admin.bookings.index') }}">Reset</a>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Booking</th>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Guests</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($bookings as $booking)
                        <tr>
                            <td>
                                <div class="fw-semibold">{{ $booking->booking_code }}</div>
                                <div class="text-muted small">{{ $booking->created_at?->format('M d, Y') }}</div>
                            </td>
                            <td>
                                <div class="fw-semibold">{{ $booking->guest?->name ?? 'N/A' }}</div>
                                <div class="text-muted small">{{ $booking->guest?->email ?? '' }}</div>
                            </td>
                            <td>
                                <div class="fw-semibold">{{ $booking->room?->room_number ?? 'N/A' }}</div>
                                <div class="text-muted small">{{ $booking->room?->roomType?->name ?? '' }}</div>
                            </td>
                            <td>
                                <div>{{ $booking->check_in_date?->format('M d, Y') }}</div>
                                <div class="text-muted small">{{ $booking->check_out_date?->format('M d, Y') }}</div>
                            </td>
                            <td>
                                @php
                                    $statusClass = $statusBadges[$booking->status] ?? 'bg-secondary';
                                @endphp
                                <span class="badge {{ $statusClass }}">
                                    {{ ucfirst(str_replace('_', ' ', $booking->status)) }}
                                </span>
                            </td>
                            <td>{{ $booking->adults }}A / {{ $booking->children }}C</td>
                            <td class="text-end">
                                <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.bookings.show', $booking) }}">View</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center text-muted py-4">No bookings found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-3">
        {{ $bookings->links() }}
    </div>
@endsection
