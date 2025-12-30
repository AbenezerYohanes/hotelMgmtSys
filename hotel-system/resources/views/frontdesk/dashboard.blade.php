@extends('layouts.app')

@section('title', 'Front Desk')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Front Desk</h1>
            <p class="text-muted mb-0">Room matrix for {{ $today->format('M d, Y') }}</p>
        </div>
        <div class="d-flex flex-wrap gap-2 align-items-center">
            <span class="badge bg-info text-dark">Open issues: {{ $openIssuesCount }}</span>
            <a class="btn btn-outline-secondary" href="{{ route('frontdesk.calendar') }}">Calendar view</a>
            <a class="btn btn-primary" href="{{ route('frontdesk.bookings.create') }}">New walk-in booking</a>
        </div>
    </div>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Floor</th>
                        <th>Room status</th>
                        <th>Booking state</th>
                        <th>Guest</th>
                        <th>Dates</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($rooms as $room)
                        @php
                            $booking = $room->current_booking;
                            $bookingState = $room->booking_state;
                            $bookingBadge = match ($bookingState) {
                                'occupied' => 'bg-danger',
                                'reserved' => 'bg-warning text-dark',
                                default => 'bg-success',
                            };
                            $roomBadge = match ($room->status) {
                                'dirty' => 'bg-warning text-dark',
                                'out_of_service' => 'bg-secondary',
                                default => 'bg-success',
                            };
                        @endphp
                        <tr>
                            <td class="fw-semibold">{{ $room->room_number }}</td>
                            <td>{{ $room->roomType?->name }}</td>
                            <td>{{ $room->floor }}</td>
                            <td>
                                <span class="badge {{ $roomBadge }}">
                                    {{ ucfirst(str_replace('_', ' ', $room->status)) }}
                                </span>
                            </td>
                            <td>
                                <span class="badge {{ $bookingBadge }}">
                                    {{ ucfirst($bookingState) }}
                                </span>
                            </td>
                            <td>{{ $booking?->guest?->name ?? 'N/A' }}</td>
                            <td>
                                @if ($booking)
                                    {{ $booking->check_in_date?->format('M d') }} to {{ $booking->check_out_date?->format('M d') }}
                                @else
                                    N/A
                                @endif
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex flex-wrap gap-2">
                                    @if ($booking)
                                        <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.bookings.show', $booking) }}">View</a>

                                        @can('frontdesk.manage')
                                            @if ($booking->status === 'pending')
                                                <form method="POST" action="{{ route('frontdesk.bookings.confirm', $booking) }}">
                                                    @csrf
                                                    @method('PATCH')
                                                    <button class="btn btn-sm btn-outline-success" type="submit">Confirm</button>
                                                </form>
                                                <form method="POST" action="{{ route('frontdesk.bookings.cancel', $booking) }}" onsubmit="return confirm('Cancel this booking?');">
                                                    @csrf
                                                    @method('PATCH')
                                                    <button class="btn btn-sm btn-outline-danger" type="submit">Cancel</button>
                                                </form>
                                            @elseif ($booking->status === 'confirmed')
                                                <form method="POST" action="{{ route('frontdesk.bookings.checkin', $booking) }}">
                                                    @csrf
                                                    @method('PATCH')
                                                    <button class="btn btn-sm btn-outline-success" type="submit">Check-in</button>
                                                </form>
                                                <form method="POST" action="{{ route('frontdesk.bookings.cancel', $booking) }}" onsubmit="return confirm('Cancel this booking?');">
                                                    @csrf
                                                    @method('PATCH')
                                                    <button class="btn btn-sm btn-outline-danger" type="submit">Cancel</button>
                                                </form>
                                            @elseif ($booking->status === 'checked_in')
                                                <form method="POST" action="{{ route('frontdesk.bookings.checkout', $booking) }}">
                                                    @csrf
                                                    @method('PATCH')
                                                    <button class="btn btn-sm btn-outline-dark" type="submit">Check-out</button>
                                                </form>
                                            @endif
                                        @endcan
                                    @endif

                                    @can('rooms.manage_status')
                                        @if ($room->status !== 'out_of_service')
                                            <form method="POST" action="{{ route('frontdesk.rooms.out-of-service', $room) }}" onsubmit="return confirm('Mark this room out of service?');">
                                                @csrf
                                                @method('PATCH')
                                                <button class="btn btn-sm btn-outline-warning" type="submit">Out of service</button>
                                            </form>
                                        @endif
                                    @endcan
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">No rooms available.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
