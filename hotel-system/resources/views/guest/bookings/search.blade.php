@extends('layouts.app')

@section('title', 'Book a Room')

@section('hero')
    <section class="site-hero site-hero-innerpage overlay" data-stellar-background-ratio="0.5"
        style="background-image: url({{ asset('heaven/images/big_image_1.jpg') }});">
        <div class="container">
            <div class="row align-items-center site-hero-inner justify-content-center">
                <div class="col-md-12 text-center">
                    <div class="mb-5 element-animate">
                        <h1>Find a Room</h1>
                        <p>Search availability and book your stay.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@section('content')
    <div class="row align-items-center mb-4">
        <div class="col-md-8">
            <h2 class="h4 mb-1">Search availability</h2>
            <p class="text-muted mb-0">Pick dates, guests, and room type to see what is open.</p>
        </div>
        <div class="col-md-4 text-md-right">
            <a class="btn btn-primary btn-sm" href="{{ route('guest.bookings.index') }}">My bookings</a>
        </div>
    </div>

    <div class="sidebar-box mb-4">
        <form method="GET" action="{{ route('guest.bookings.search') }}">
            <div class="row">
                <div class="col-md-3 form-group">
                    <label for="check_in_date">Check-in</label>
                    <input id="check_in_date" type="date" name="check_in_date" class="form-control"
                        value="{{ old('check_in_date', $criteria['check_in_date'] ?? '') }}" required>
                </div>
                <div class="col-md-3 form-group">
                    <label for="check_out_date">Check-out</label>
                    <input id="check_out_date" type="date" name="check_out_date" class="form-control"
                        value="{{ old('check_out_date', $criteria['check_out_date'] ?? '') }}" required>
                </div>
                <div class="col-md-3 form-group">
                    <label for="room_type_id">Room type</label>
                    <select id="room_type_id" name="room_type_id" class="form-control">
                        <option value="">Any type</option>
                        @foreach ($roomTypes as $roomType)
                            <option value="{{ $roomType->id }}"
                                @if (old('room_type_id', $criteria['room_type_id'] ?? '') == $roomType->id) selected @endif>
                                {{ $roomType->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-2 form-group">
                    <label for="adults">Adults</label>
                    <input id="adults" type="number" name="adults" class="form-control" min="1"
                        value="{{ old('adults', $criteria['adults'] ?? 1) }}" required>
                </div>
                <div class="col-md-1 form-group">
                    <label for="children">Kids</label>
                    <input id="children" type="number" name="children" class="form-control" min="0"
                        value="{{ old('children', $criteria['children'] ?? 0) }}">
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-md-3 form-group">
                    <button class="btn btn-primary btn-sm" type="submit">Search</button>
                </div>
                <div class="col-md-3 form-group">
                    <a class="btn btn-outline-secondary btn-sm" href="{{ route('guest.bookings.search') }}">Reset</a>
                </div>
            </div>
        </form>
    </div>

    @if ($criteria)
        <div class="row align-items-center mb-3">
            <div class="col-md-8">
                <h3 class="h5 mb-1">Available rooms</h3>
                <p class="text-muted mb-0">
                    {{ $criteria['check_in_date'] }} to {{ $criteria['check_out_date'] }}
                </p>
            </div>
            <div class="col-md-4 text-md-right">
                <span class="badge badge-info">
                    {{ $availableRooms->count() }} room{{ $availableRooms->count() === 1 ? '' : 's' }}
                </span>
            </div>
        </div>

        @if ($availableRooms->isEmpty())
            <p class="text-muted">No rooms match the selected dates and guests.</p>
        @else
            @php
                $roomImages = ['img_1.jpg', 'img_2.jpg', 'img_3.jpg', 'img_4.jpg', 'img_5.jpg', 'img_6.jpg'];
            @endphp
            <div class="row">
                @foreach ($availableRooms as $room)
                    @php $roomImage = $roomImages[$loop->index % count($roomImages)]; @endphp
                    <div class="col-md-6 mb-4">
                        <div class="media d-block room mb-0">
                            <figure>
                                <img src="{{ asset('heaven/images/'.$roomImage) }}" alt="Room image" class="img-fluid">
                                <div class="overlap-text">
                                    <span>
                                        Available Room
                                        <span class="ion-ios-star"></span>
                                        <span class="ion-ios-star"></span>
                                        <span class="ion-ios-star"></span>
                                    </span>
                                </div>
                            </figure>
                            <div class="media-body">
                                <h3 class="mt-0">
                                    <a href="#">{{ $room->roomType?->name }} ({{ $room->room_number }})</a>
                                </h3>
                                <ul class="room-specs">
                                    <li><span class="ion-ios-people-outline"></span> {{ $room->roomType?->max_occupancy }} Guests</li>
                                    <li><span class="ion-ios-keypad"></span> Room {{ $room->room_number }}</li>
                                </ul>
                                <p>
                                    {{ $room->roomType?->description ?? 'Comfortable stay with modern amenities.' }}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-muted">
                                        ${{ number_format($room->roomType?->price_per_night ?? 0, 2) }} / night
                                    </span>
                                    <form method="POST" action="{{ route('guest.bookings.store') }}">
                                        @csrf
                                        <input type="hidden" name="room_id" value="{{ $room->id }}">
                                        <input type="hidden" name="check_in_date" value="{{ $criteria['check_in_date'] }}">
                                        <input type="hidden" name="check_out_date" value="{{ $criteria['check_out_date'] }}">
                                        <input type="hidden" name="adults" value="{{ $criteria['adults'] }}">
                                        <input type="hidden" name="children" value="{{ $criteria['children'] }}">
                                        <button class="btn btn-primary btn-sm" type="submit">Book now</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            <p class="small text-muted">
                Bookings are created as pending and confirmed by staff.
            </p>
        @endif
    @endif
@endsection
