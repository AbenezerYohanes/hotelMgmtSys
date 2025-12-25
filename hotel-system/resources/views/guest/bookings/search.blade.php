@extends('layouts.app')

@section('title', 'Book a Room')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Find a room</h1>
            <p class="text-muted mb-0">Search availability and book your stay.</p>
        </div>
        <a class="btn btn-outline-secondary" href="{{ route('guest.bookings.index') }}">My bookings</a>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('guest.bookings.search') }}" class="row g-3 align-items-end">
                <div class="col-md-3">
                    <x-form.input
                        name="check_in_date"
                        type="date"
                        label="Check-in"
                        :value="$criteria['check_in_date'] ?? null"
                        required
                    />
                </div>
                <div class="col-md-3">
                    <x-form.input
                        name="check_out_date"
                        type="date"
                        label="Check-out"
                        :value="$criteria['check_out_date'] ?? null"
                        required
                    />
                </div>
                <div class="col-md-3">
                    <x-form.select
                        name="room_type_id"
                        label="Room type"
                        :options="$roomTypes->pluck('name', 'id')->all()"
                        :selected="$criteria['room_type_id'] ?? null"
                        placeholder="Any type"
                    />
                </div>
                <div class="col-md-3">
                    <x-form.input
                        name="adults"
                        type="number"
                        label="Adults"
                        min="1"
                        :value="$criteria['adults'] ?? 1"
                        required
                    />
                </div>
                <div class="col-md-3">
                    <x-form.input
                        name="children"
                        type="number"
                        label="Children"
                        min="0"
                        :value="$criteria['children'] ?? 0"
                    />
                </div>
                <div class="col-md-3">
                    <button class="btn btn-primary w-100" type="submit">Search availability</button>
                </div>
                <div class="col-md-3">
                    <a class="btn btn-outline-secondary w-100" href="{{ route('guest.bookings.search') }}">Reset</a>
                </div>
            </form>
        </div>
    </div>

    @if ($criteria)
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 class="h5 mb-1">Available rooms</h2>
                        <p class="text-muted mb-0">
                            {{ $criteria['check_in_date'] }} to {{ $criteria['check_out_date'] }}
                        </p>
                    </div>
                    <span class="badge bg-info text-dark">
                        {{ $availableRooms->count() }} room{{ $availableRooms->count() === 1 ? '' : 's' }}
                    </span>
                </div>

                @if ($availableRooms->isEmpty())
                    <p class="text-muted mb-0">No rooms match the selected dates and guests.</p>
                @else
                    <div class="table-responsive">
                        <table class="table table-striped align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Room</th>
                                    <th>Type</th>
                                    <th>Max occupancy</th>
                                    <th class="text-end">Price / night</th>
                                    <th class="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($availableRooms as $room)
                                    <tr>
                                        <td class="fw-semibold">{{ $room->room_number }}</td>
                                        <td>{{ $room->roomType?->name }}</td>
                                        <td>{{ $room->roomType?->max_occupancy }}</td>
                                        <td class="text-end">
                                            {{ number_format($room->roomType?->price_per_night ?? 0, 2) }}
                                        </td>
                                        <td class="text-end">
                                            <form method="POST" action="{{ route('guest.bookings.store') }}">
                                                @csrf
                                                <input type="hidden" name="room_id" value="{{ $room->id }}">
                                                <input type="hidden" name="check_in_date" value="{{ $criteria['check_in_date'] }}">
                                                <input type="hidden" name="check_out_date" value="{{ $criteria['check_out_date'] }}">
                                                <input type="hidden" name="adults" value="{{ $criteria['adults'] }}">
                                                <input type="hidden" name="children" value="{{ $criteria['children'] }}">
                                                <button class="btn btn-sm btn-primary" type="submit">Book now</button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <p class="small text-muted mt-3 mb-0">
                        Bookings are created as pending and confirmed by staff.
                    </p>
                @endif
            </div>
        </div>
    @endif
@endsection
