<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @include('partials.site-head')
</head>
<body class="ihms-home ihms-with-header ihms-no-sidebar ihms-fullwidth">
    @include('partials.site-header')

    <section class="site-hero overlay" data-stellar-background-ratio="0.5"
        style="background-image: url({{ asset('heaven/images/big_image_1.jpg') }});">
        <div class="container">
            <div class="row align-items-center site-hero-inner justify-content-center">
                <div class="col-md-12 text-center">
                    <div class="mb-5 element-animate">
                        <h1>Heaven Hotel Management System</h1>
                        <p>Book rooms, manage stays, and run hotel operations in one place.</p>
                        <p class="ihms-hero-cta">
                            @auth
                                @if (auth()->user()->hasAnyRole(['Guest', 'Admin']))
                                    <a href="{{ route('guest.bookings.search') }}" class="btn btn-primary">Book Now</a>
                                    <a href="{{ route('dashboard') }}" class="btn btn-outline-light">Dashboard</a>
                                @else
                                    <a href="{{ route('dashboard') }}" class="btn btn-primary">Go to Dashboard</a>
                                    <a href="{{ route('home') }}#quick-book" class="btn btn-outline-light">Guest Booking</a>
                                @endif
                            @else
                                <a href="#quick-book" class="btn btn-primary">Book Now</a>
                                <a href="{{ route('login') }}" class="btn btn-outline-light">Log In</a>
                            @endauth
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="site-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-4">
                    <div class="heading-wrap text-center element-animate">
                        <h4 class="sub-heading">Smart hospitality</h4>
                        <h2 class="heading">Stay and Manage</h2>
                        <p class="mb-5">
                            Guests book instantly while staff track rooms, housekeeping, maintenance, and reports.
                        </p>
                        <p><a href="#quick-book" class="btn btn-primary btn-sm">Start a booking</a></p>
                    </div>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-7">
                    <img src="{{ asset('heaven/images/f_img_1.png') }}" alt="Hotel overview" class="img-md-fluid">
                </div>
            </div>
        </div>
    </section>

    <section class="site-section bg-light ihms-landing-section" id="quick-book">
        <div class="container">
            <div class="row mb-5">
                <div class="col-md-12 heading-wrap text-center">
                    <h4 class="sub-heading">Quick guest booking</h4>
                    <h2 class="heading">Book in One Step</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <h2 class="mb-4">Reserve your stay</h2>
                    <x-flash />
                    <x-validation-errors />

                    @auth
                        <p class="text-muted">
                            Welcome back, {{ auth()->user()->name }}. Search for rooms below.
                        </p>
                    @endauth

                    @php
                        $canBook = ! auth()->check() || auth()->user()->hasAnyRole(['Guest', 'Admin']);
                    @endphp

                    @if ($canBook)
                        <form class="ihms-quick-book" method="{{ auth()->check() ? 'GET' : 'POST' }}"
                            action="{{ auth()->check() ? route('guest.bookings.search') : route('quick-book') }}">
                            @guest
                                @csrf
                            @endguest
                            @guest
                                <div class="row">
                                    <div class="col-sm-6 form-group">
                                        <label for="quick_name">Full name</label>
                                        <input type="text" id="quick_name" name="name" class="form-control"
                                            value="{{ old('name') }}" required>
                                    </div>
                                    <div class="col-sm-6 form-group">
                                        <label for="quick_email">Email</label>
                                        <input type="email" id="quick_email" name="email" class="form-control"
                                            value="{{ old('email') }}" required>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12 form-group">
                                        <label for="quick_password">Password</label>
                                        <input type="password" id="quick_password" name="password" class="form-control" required>
                                    </div>
                                </div>
                            @endguest

                            <div class="row">
                                <div class="col-sm-6 form-group">
                                    <label for="quick_check_in">Check-in</label>
                                    <input type="date" id="quick_check_in" name="check_in_date" class="form-control"
                                        value="{{ old('check_in_date') }}" required>
                                </div>
                                <div class="col-sm-6 form-group">
                                    <label for="quick_check_out">Check-out</label>
                                    <input type="date" id="quick_check_out" name="check_out_date" class="form-control"
                                        value="{{ old('check_out_date') }}" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label for="quick_room_type">Room type</label>
                                    <select id="quick_room_type" name="room_type_id" class="form-control">
                                        <option value="">Any type</option>
                                        @foreach ($roomTypes as $roomType)
                                            <option value="{{ $roomType->id }}"
                                                @if (old('room_type_id') == $roomType->id) selected @endif>
                                                {{ $roomType->name }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="col-md-3 form-group">
                                    <label for="quick_adults">Adults</label>
                                    <input type="number" id="quick_adults" name="adults" class="form-control" min="1"
                                        value="{{ old('adults', 1) }}" required>
                                </div>
                                <div class="col-md-3 form-group">
                                    <label for="quick_children">Children</label>
                                    <input type="number" id="quick_children" name="children" class="form-control" min="0"
                                        value="{{ old('children', 0) }}">
                                </div>
                            </div>

                            <div class="row align-items-center">
                                <div class="col-md-6 form-group">
                                    <input type="submit" value="{{ auth()->check() ? 'Search Availability' : 'Create Account & Search' }}"
                                        class="btn btn-primary">
                                </div>
                                @guest
                                    <div class="col-md-6 form-group text-md-right">
                                        <a href="{{ route('login') }}">Already have an account?</a>
                                    </div>
                                @endguest
                            </div>
                        </form>
                    @else
                        <div class="sidebar-box">
                            <h3 class="heading">Staff access</h3>
                            <p class="text-muted">
                                Booking is available to guest accounts. Use the Modules menu above to access your tools.
                            </p>
                            <a href="{{ route('dashboard') }}" class="btn btn-primary btn-sm">Go to dashboard</a>
                        </div>
                    @endif
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-5">
                    @php
                        $featuredRoom = $roomTypes->first();
                        $featureImage = 'img_1.jpg';
                    @endphp
                    <h3 class="mb-4">Featured Room</h3>
                    @if ($featuredRoom)
                        <div class="media d-block room mb-0">
                            <figure>
                                <img src="{{ asset('heaven/images/'.$featureImage) }}" alt="Featured room" class="img-fluid">
                                <div class="overlap-text">
                                    <span>
                                        Featured Room
                                        <span class="ion-ios-star"></span>
                                        <span class="ion-ios-star"></span>
                                        <span class="ion-ios-star"></span>
                                    </span>
                                </div>
                            </figure>
                            <div class="media-body">
                                <h3 class="mt-0">
                                    <a href="{{ route('guest.bookings.search', ['room_type_id' => $featuredRoom->id]) }}">
                                        {{ $featuredRoom->name }}
                                    </a>
                                </h3>
                                <ul class="room-specs">
                                    <li><span class="ion-ios-people-outline"></span> {{ $featuredRoom->max_occupancy }} Guests</li>
                                    <li><span class="fa fa-tag"></span> ${{ number_format($featuredRoom->price_per_night, 2) }} / night</li>
                                </ul>
                                <p>{{ $featuredRoom->description ?? 'Reserve this room type for a refined stay.' }}</p>
                                <p>
                                    <a href="{{ route('guest.bookings.search', ['room_type_id' => $featuredRoom->id]) }}"
                                        class="btn btn-primary btn-sm">
                                        Explore Rooms
                                    </a>
                                </p>
                            </div>
                        </div>
                    @else
                        <div class="sidebar-box">
                            <p class="text-muted mb-0">
                                Add room types in the admin panel to highlight featured stays here.
                            </p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </section>

    <section class="site-section bg-light ihms-landing-section">
        <div class="container">
            <div class="row mb-5">
                <div class="col-md-12 heading-wrap text-center">
                    <h4 class="sub-heading">Our Luxury Rooms</h4>
                    <h2 class="heading">Featured Rooms</h2>
                </div>
            </div>
            @php
                $featuredRooms = $roomTypes->take(3);
                $featuredImages = ['img_1.jpg', 'img_2.jpg', 'img_3.jpg'];
            @endphp
            <div class="row">
                @forelse ($featuredRooms as $roomType)
                    @php
                        $roomImage = $featuredImages[$loop->index % count($featuredImages)];
                    @endphp
                    <div class="col-md-4 mb-4">
                        <div class="media d-block room mb-0">
                            <figure>
                                <img src="{{ asset('heaven/images/'.$roomImage) }}" alt="{{ $roomType->name }}" class="img-fluid">
                                <div class="overlap-text">
                                    <span>
                                        Room Type
                                        <span class="ion-ios-star"></span>
                                        <span class="ion-ios-star"></span>
                                        <span class="ion-ios-star"></span>
                                    </span>
                                </div>
                            </figure>
                            <div class="media-body">
                                <h3 class="mt-0">
                                    <a href="{{ route('guest.bookings.search', ['room_type_id' => $roomType->id]) }}">
                                        {{ $roomType->name }}
                                    </a>
                                </h3>
                                <ul class="room-specs">
                                    <li><span class="ion-ios-people-outline"></span> {{ $roomType->max_occupancy }} Guests</li>
                                    <li><span class="fa fa-tag"></span> ${{ number_format($roomType->price_per_night, 2) }} / night</li>
                                </ul>
                                <p>{{ $roomType->description ?? 'Comfortable stay with modern amenities.' }}</p>
                                <p>
                                    <a href="{{ route('guest.bookings.search', ['room_type_id' => $roomType->id]) }}"
                                        class="btn btn-primary btn-sm">
                                        Book Now
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="col-md-12 text-center">
                        <p class="text-muted mb-0">
                            Add room types in the admin panel to showcase featured rooms here.
                        </p>
                    </div>
                @endforelse
            </div>
        </div>
    </section>

    <section class="section-cover" data-stellar-background-ratio="0.5"
        style="background-image: url({{ asset('heaven/images/img_5.jpg') }});">
        <div class="container">
            <div class="row justify-content-center align-items-center intro">
                <div class="col-md-9 text-center element-animate">
                    <h2>Relax and Enjoy your Holiday</h2>
                    <p class="lead mb-5">
                        From quick guest bookings to real-time operations, Heaven keeps everything in sync.
                    </p>
                </div>
            </div>
        </div>
    </section>

    @include('partials.site-footer')
    @include('partials.site-scripts')
</body>
</html>
