@extends('layouts.app')

@section('title', 'Front Desk Calendar')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Booking calendar</h1>
            <p class="text-muted mb-0">Monthly view of room bookings.</p>
        </div>
        <div class="d-flex gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('frontdesk.dashboard') }}">Room matrix</a>
            <a class="btn btn-primary" href="{{ route('frontdesk.bookings.create') }}">New walk-in booking</a>
        </div>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">
            <div id="frontdesk-calendar"></div>
        </div>
    </div>
@endsection

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css">
@endpush

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const calendarEl = document.getElementById('frontdesk-calendar');
            const events = @json($events);

            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                height: 'auto',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                },
                events: events,
            });

            calendar.render();
        });
    </script>
@endpush
