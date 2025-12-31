@extends('layouts.app')

@section('title', 'My Bookings')

@section('hero')
    <section class="site-hero site-hero-innerpage overlay" data-stellar-background-ratio="0.5"
        style="background-image: url({{ asset('heaven/images/big_image_1.jpg') }});">
        <div class="container">
            <div class="row align-items-center site-hero-inner justify-content-center">
                <div class="col-md-12 text-center">
                    <div class="mb-5 element-animate">
                        <h1>My Bookings</h1>
                        <p>Track your reservations and status.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@section('content')
    <div class="row align-items-center mb-4">
        <div class="col-md-8">
            <h2 class="h4 mb-1">Your reservations</h2>
            <p class="text-muted mb-0">Manage upcoming stays and booking status.</p>
        </div>
        <div class="col-md-4 text-md-right">
            <a class="btn btn-primary btn-sm" href="{{ route('guest.bookings.search') }}">Search availability</a>
        </div>
    </div>

    <div class="sidebar-box ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped mb-0">
                <thead>
                    <tr>
                        <th>Booking code</th>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($bookings as $booking)
                        @php
                            $statusClass = match ($booking->status) {
                                'confirmed' => 'badge-primary',
                                'checked_in' => 'badge-success',
                                'checked_out' => 'badge-secondary',
                                'cancelled' => 'badge-danger',
                                default => 'badge-warning',
                            };
                        @endphp
                        <tr>
                            <td class="font-weight-bold">{{ $booking->booking_code }}</td>
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
                            <td class="text-right">
                                @if ($booking->isCancellable())
                                    <form method="POST" action="{{ route('guest.bookings.cancel', $booking) }}"
                                        onsubmit="return confirm('Cancel this booking?');">
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

    <div class="mt-4">
        {{ $bookings->links() }}
    </div>
@endsection
