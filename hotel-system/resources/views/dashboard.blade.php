@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
    @php
        $roles = auth()->user()->getRoleNames();
        $openIssuesCount = $openIssuesCount ?? 0;
        $attendanceToday = $attendanceToday ?? null;
        $myBookings = $myBookings ?? collect();
    @endphp

    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h4 mb-1">Dashboard</h1>
            <p class="text-muted mb-0">
                Welcome back, <strong>{{ auth()->user()->name }}</strong>.
            </p>
        </div>
        <div class="text-end">
            <div class="small text-muted">Roles</div>
            <div class="fw-semibold">
                {{ $roles->isNotEmpty() ? $roles->implode(', ') : 'No role assigned' }}
            </div>
        </div>
    </div>

    @if (auth()->user()->employee)
        @php
            $clockInTime = $attendanceToday?->clock_in_time;
            $clockOutTime = $attendanceToday?->clock_out_time;
            $attendanceStatus = $attendanceToday?->status ?? 'Not started';
        @endphp
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                        <h2 class="h6 mb-1">Today's attendance</h2>
                        <div class="text-muted small">Status: {{ ucfirst(str_replace('_', ' ', $attendanceStatus)) }}</div>
                        <div class="text-muted small">Clock in: {{ $clockInTime ?? 'N/A' }}</div>
                        <div class="text-muted small">Clock out: {{ $clockOutTime ?? 'N/A' }}</div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        @if (! $clockInTime)
                            <form method="POST" action="{{ route('attendance.clock-in') }}">
                                @csrf
                                <button class="btn btn-outline-success" type="submit">Clock In</button>
                            </form>
                        @elseif (! $clockOutTime)
                            <form method="POST" action="{{ route('attendance.clock-out') }}">
                                @csrf
                                <button class="btn btn-outline-dark" type="submit">Clock Out</button>
                            </form>
                        @else
                            <span class="text-muted small">Clocked out for today.</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    @endif

    @role('Guest')
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h2 class="h5 mb-2">Guest dashboard</h2>
                <p class="text-muted mb-0">Manage your reservations and upcoming stays.</p>
            </div>
        </div>
        <div class="row g-3 mb-4">
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Upcoming stay</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Book a room</h3>
                        <p class="text-muted">Search availability and confirm bookings.</p>
                        @can('bookings.view')
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('guest.bookings.search') }}">Search availability</a>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Profile & preferences</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <h3 class="h6 mb-0">My bookings</h3>
                    <a class="btn btn-sm btn-outline-secondary" href="{{ route('guest.bookings.index') }}">View all</a>
                </div>
                @if ($myBookings->isEmpty())
                    <p class="text-muted mb-0">No bookings yet.</p>
                @else
                    <div class="table-responsive">
                        <table class="table table-sm align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Room</th>
                                    <th>Dates</th>
                                    <th>Status</th>
                                    <th class="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($myBookings as $booking)
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
                                        <td>
                                            {{ $booking->check_in_date?->format('M d') }} to {{ $booking->check_out_date?->format('M d') }}
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
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </div>
        </div>
    @endrole

    @role('FrontDesk')
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h2 class="h5 mb-2">Front desk dashboard</h2>
                <p class="text-muted mb-0">Track check-ins, room assignments, and walk-ins.</p>
                <div class="d-flex flex-wrap gap-2 align-items-center mt-2">
                    <span class="badge bg-info text-dark">Open issues: {{ $openIssuesCount }}</span>
                    @can('maintenance.view')
                        <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.index') }}">Maintenance issues</a>
                    @endcan
                </div>
            </div>
        </div>
        <div class="row g-3 mb-5">
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Arrivals today</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Front desk workflow</h3>
                        <p class="text-muted">Check-in/check-out, room moves, and upgrades.</p>
                        @can('frontdesk.view')
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.dashboard') }}">Open front desk</a>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Payments & folios</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
        </div>
    @endrole

    @role('Housekeeper')
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h2 class="h5 mb-2">Housekeeping dashboard</h2>
                <p class="text-muted mb-0">Stay on top of room readiness and service requests.</p>
                <div class="d-flex flex-wrap gap-2 align-items-center mt-2">
                    <span class="badge bg-info text-dark">Open issues: {{ $openIssuesCount }}</span>
                    @can('maintenance.report')
                        <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.create') }}">Report issue</a>
                    @endcan
                </div>
            </div>
        </div>
        <div class="row g-3 mb-5">
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Assigned rooms</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Cleaning status</h3>
                        <p class="text-muted">Room turnaround and inspections.</p>
                        @can('housekeeping.view')
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('housekeeping.dashboard') }}">Open housekeeping</a>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Supplies</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
        </div>
    @endrole

    @role('HRManager')
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h2 class="h5 mb-2">HR dashboard</h2>
                <p class="text-muted mb-0">Track employee profiles, shifts, and attendance.</p>
                <div class="d-flex flex-wrap gap-2 align-items-center mt-2">
                    <span class="badge bg-info text-dark">Open issues: {{ $openIssuesCount }}</span>
                    @can('maintenance.report')
                        <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.create') }}">Report issue</a>
                    @endcan
                </div>
            </div>
        </div>
        <div class="row g-3 mb-5">
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Team overview</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Schedules & shifts</h3>
                        <p class="text-muted">Build weekly schedules and manage coverage.</p>
                        @can('hr.view')
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.dashboard') }}">Open HR module</a>
                        @endcan
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Attendance</h3>
                        <p class="text-muted mb-0">Coming next.</p>
                    </div>
                </div>
            </div>
        </div>
    @endrole

    @role('Admin')
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h2 class="h5 mb-2">Admin dashboard</h2>
                <p class="text-muted mb-0">Configure settings, manage access, and review system health.</p>
                <div class="d-flex flex-wrap gap-2 align-items-center mt-2">
                    <span class="badge bg-info text-dark">Open issues: {{ $openIssuesCount }}</span>
                    @can('maintenance.view')
                        <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.index') }}">Maintenance issues</a>
                    @endcan
                </div>
            </div>
        </div>
        <div class="row g-3">
            <div class="col-md-6 col-xl-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Admin panel</h3>
                        <p class="text-muted">Core configuration and inventory management.</p>
                        <div class="d-flex flex-wrap gap-2">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.dashboard') }}">Open admin</a>
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.rooms.index') }}">Rooms</a>
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.room-types.index') }}">Room types</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Operations</h3>
                        <p class="text-muted">Front desk, housekeeping, and maintenance.</p>
                        <div class="d-flex flex-wrap gap-2">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.dashboard') }}">Front desk</a>
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('housekeeping.assignments.index') }}">Assignments</a>
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('maintenance.issues.index') }}">Issues</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">People & shifts</h3>
                        <p class="text-muted">Employees, schedules, and attendance.</p>
                        <div class="d-flex flex-wrap gap-2">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.employees.index') }}">Employees</a>
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.schedule.index') }}">Schedule</a>
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.attendance.index') }}">Attendance</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-xl-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h3 class="h6">Reports & audit</h3>
                        <p class="text-muted">Performance insights and activity logs.</p>
                        <div class="d-flex flex-wrap gap-2">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.reports.index') }}">Reports</a>
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.audit-logs.index') }}">Audit logs</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endrole
@endsection
