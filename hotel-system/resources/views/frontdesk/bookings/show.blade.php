@extends('layouts.app')

@section('title', 'Booking '.$booking->booking_code)

@section('content')
    @php
        $statusClass = match ($booking->status) {
            'confirmed' => 'bg-primary',
            'checked_in' => 'bg-success',
            'checked_out' => 'bg-secondary',
            'cancelled' => 'bg-danger',
            default => 'bg-warning text-dark',
        };
    @endphp

    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Booking {{ $booking->booking_code }}</h1>
            <p class="text-muted mb-0">Front desk booking details</p>
        </div>
        <div class="d-flex gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('frontdesk.dashboard') }}">Back to matrix</a>
            <a class="btn btn-outline-secondary" href="{{ route('frontdesk.calendar') }}">Calendar</a>
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="text-muted small">Guest</div>
                    <div class="fw-semibold">{{ $booking->guest?->name }}</div>
                    <div class="text-muted">{{ $booking->guest?->email }}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small">Room</div>
                    <div class="fw-semibold">{{ $booking->room?->room_number }}</div>
                    <div class="text-muted">{{ $booking->room?->roomType?->name }}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small">Status</div>
                    <span class="badge {{ $statusClass }}">
                        {{ ucfirst(str_replace('_', ' ', $booking->status)) }}
                    </span>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small">Dates</div>
                    <div class="fw-semibold">
                        {{ $booking->check_in_date?->format('M d, Y') }} to {{ $booking->check_out_date?->format('M d, Y') }}
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small">Guests</div>
                    <div class="fw-semibold">{{ $booking->adults }} Adults, {{ $booking->children }} Children</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted small">Notes</div>
                    <div class="fw-semibold">{{ $booking->notes ?: 'N/A' }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h2 class="h6 mb-3">Invoice</h2>
            @if ($booking->invoice)
                @php
                    $paymentClass = match ($booking->invoice->payment_status) {
                        'paid' => 'bg-success',
                        'partial' => 'bg-warning text-dark',
                        default => 'bg-secondary',
                    };
                @endphp
                <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                        <div class="text-muted small">Invoice number</div>
                        <div class="fw-semibold">{{ $booking->invoice->invoice_number }}</div>
                        <div class="text-muted small">Total</div>
                        <div class="fw-semibold">{{ number_format($booking->invoice->total, 2) }}</div>
                    </div>
                    <div class="text-end">
                        <span class="badge {{ $paymentClass }}">
                            {{ ucfirst($booking->invoice->payment_status) }}
                        </span>
                        <div class="mt-2">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.invoices.show', $booking->invoice) }}">View invoice</a>
                        </div>
                    </div>
                </div>
            @else
                <p class="text-muted mb-0">Invoice will be created when the guest checks out.</p>
            @endif
        </div>
    </div>

    <div class="d-flex flex-wrap gap-2">
        @can('frontdesk.manage')
            @if ($booking->status === 'pending')
                <form method="POST" action="{{ route('frontdesk.bookings.confirm', $booking) }}">
                    @csrf
                    @method('PATCH')
                    <button class="btn btn-outline-success" type="submit">Confirm booking</button>
                </form>
                <form method="POST" action="{{ route('frontdesk.bookings.cancel', $booking) }}" onsubmit="return confirm('Cancel this booking?');">
                    @csrf
                    @method('PATCH')
                    <button class="btn btn-outline-danger" type="submit">Cancel booking</button>
                </form>
            @elseif ($booking->status === 'confirmed')
                <form method="POST" action="{{ route('frontdesk.bookings.checkin', $booking) }}">
                    @csrf
                    @method('PATCH')
                    <button class="btn btn-outline-success" type="submit">Check-in guest</button>
                </form>
                <form method="POST" action="{{ route('frontdesk.bookings.cancel', $booking) }}" onsubmit="return confirm('Cancel this booking?');">
                    @csrf
                    @method('PATCH')
                    <button class="btn btn-outline-danger" type="submit">Cancel booking</button>
                </form>
            @elseif ($booking->status === 'checked_in')
                <form method="POST" action="{{ route('frontdesk.bookings.checkout', $booking) }}">
                    @csrf
                    @method('PATCH')
                    <button class="btn btn-outline-dark" type="submit">Check-out guest</button>
                </form>
            @else
                <span class="text-muted">No actions available for this booking.</span>
            @endif
        @else
            <span class="text-muted">You do not have permission to manage this booking.</span>
        @endcan
    </div>
@endsection
