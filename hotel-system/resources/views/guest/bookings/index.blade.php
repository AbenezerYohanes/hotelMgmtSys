@extends('layouts.app')

@section('title', 'My Bookings')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">My Bookings</h1>
            <p class="text-muted mb-0">Track your reservations and status.</p>
        </div>
        <a class="btn btn-outline-primary" href="{{ route('guest.bookings.search') }}">Search availability</a>
    </div>

    <div class="card shadow-sm">
        <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Booking code</th>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th class="text-end">Action</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($bookings as $booking)
                        @php
                            $statusClass = match ($booking->status) {
                                'confirmed' => 'bg-primary',
                                'checked_in' => 'bg-success',
                                'checked_out' => 'bg-secondary',
                                'cancelled' => 'bg-danger',
                                default => 'bg-warning text-dark',
                            };
                        @endphp
                        <tr>
                            <td class="fw-semibold">{{ $booking->booking_code }}</td>
                            <td>{{ $booking->room?->room_number }}</td>
                            <td>{{ $booking->room?->roomType?->name }}</td>
                            <td>
                                {{ $booking->check_in_date?->format('M d, Y') }} to {{ $booking->check_out_date?->format('M d, Y') }}
                            </td>
                            <td>
                                <span class="badge {{ $statusClass }}">
                                    {{ ucfirst(str_replace('_', ' ', $booking->status)) }}
                                </span>
                            </td>
                            <td class="text-end">
                                @if ($booking->isCancellable())
                                    <form method="POST" action="{{ route('guest.bookings.cancel', $booking) }}" onsubmit="return confirm('Cancel this booking?');">
                                        @csrf
                                        @method('PATCH')
                                        <button class="btn btn-sm btn-outline-danger" type="submit">Cancel</button>
                                    </form>
                                @else
                                    <span class="text-muted small">Not cancellable</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No bookings yet.</td>
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
