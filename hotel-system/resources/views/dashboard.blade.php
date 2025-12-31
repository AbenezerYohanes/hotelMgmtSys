@extends('layouts.app')

@section('title', 'Dashboard')
@section('body-class', 'ihms-dashboard')
@section('container-class', 'container-fluid ihms-dashboard-container')

@section('content')
    @php
        $roles = auth()->user()->getRoleNames();
        $openIssuesCount = $openIssuesCount ?? 0;
        $attendanceToday = $attendanceToday ?? null;
        $myBookings = $myBookings ?? collect();
    @endphp

    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3 mb-1">Dashboard</h1>
            <p class="text-muted mb-0">
                Welcome back, <strong>{{ auth()->user()->name }}</strong>.
            </p>
        </div>
        <div class="ihms-chips mt-3 mt-md-0">
            <span class="ihms-chip is-info">
                Roles: {{ $roles->isNotEmpty() ? $roles->implode(', ') : 'No role assigned' }}
            </span>
            @if (auth()->user()->can('maintenance.view') || auth()->user()->can('maintenance.report'))
                <span class="ihms-chip is-alert">Open issues: {{ $openIssuesCount }}</span>
            @endif
        </div>
    </div>

    @if (auth()->user()->employee)
        @php
            $clockInTime = $attendanceToday?->clock_in_time;
            $clockOutTime = $attendanceToday?->clock_out_time;
            $attendanceStatus = $attendanceToday?->status ?? 'Not started';
        @endphp
        <div class="ihms-module-card mb-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <div>
                    <div class="module-title">Today's attendance</div>
                    <div class="text-muted small">Status: {{ ucfirst(str_replace('_', ' ', $attendanceStatus)) }}</div>
                    <div class="text-muted small">Clock in: {{ $clockInTime ?? 'N/A' }}</div>
                    <div class="text-muted small">Clock out: {{ $clockOutTime ?? 'N/A' }}</div>
                </div>
                <div class="module-actions">
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
    @endif

    @role('Guest')
        <div class="ihms-module-card mb-4">
            <div class="module-title">Guest dashboard</div>
            <p class="text-muted mb-0">Manage your reservations and upcoming stays.</p>
        </div>
        <div class="row ihms-module-grid">
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-suitcase"></div>
                    <div class="module-title">Upcoming stay</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-search"></div>
                    <div class="module-title">Book a room</div>
                    <p class="text-muted">Search availability and confirm bookings.</p>
                    @can('bookings.view')
                        <div class="module-actions">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('guest.bookings.search') }}">Search availability</a>
                        </div>
                    @endcan
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-user"></div>
                    <div class="module-title">Profile & preferences</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
        </div>

        <div class="ihms-module-card ihms-table-card">
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div class="module-title mb-0">My bookings</div>
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
                                        'confirmed' => 'badge-primary',
                                        'checked_in' => 'badge-success',
                                        'checked_out' => 'badge-secondary',
                                        'cancelled' => 'badge-danger',
                                        default => 'badge-warning',
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
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    @endrole

    @role('FrontDesk')
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-5">
            <div>
                <h2 class="h5 mb-1">Front desk</h2>
                <p class="text-muted mb-0">Track check-ins, room assignments, and walk-ins.</p>
            </div>
            <div class="ihms-chips mt-3 mt-md-0">
                <span class="ihms-chip is-info">Shift: Today</span>
                <span class="ihms-chip is-alert">Open issues: {{ $openIssuesCount }}</span>
                @can('maintenance.view')
                    <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.index') }}">Maintenance issues</a>
                @endcan
            </div>
        </div>
        <div class="row ihms-module-grid">
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-calendar"></div>
                    <div class="module-title">Arrivals today</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-exchange"></div>
                    <div class="module-title">Front desk workflow</div>
                    <p class="text-muted">Check-in/check-out, room moves, and upgrades.</p>
                    @can('frontdesk.view')
                        <div class="module-actions">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.dashboard') }}">Open front desk</a>
                        </div>
                    @endcan
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-credit-card"></div>
                    <div class="module-title">Payments & folios</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
        </div>
    @endrole

    @role('Housekeeper')
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-5">
            <div>
                <h2 class="h5 mb-1">Housekeeping</h2>
                <p class="text-muted mb-0">Stay on top of room readiness and service requests.</p>
            </div>
            <div class="ihms-chips mt-3 mt-md-0">
                <span class="ihms-chip is-info">Rooms: Active</span>
                <span class="ihms-chip is-alert">Open issues: {{ $openIssuesCount }}</span>
                @can('maintenance.report')
                    <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.create') }}">Report issue</a>
                @endcan
            </div>
        </div>
        <div class="row ihms-module-grid">
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-list-alt"></div>
                    <div class="module-title">Assigned rooms</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-check"></div>
                    <div class="module-title">Cleaning status</div>
                    <p class="text-muted">Room turnaround and inspections.</p>
                    @can('housekeeping.view')
                        <div class="module-actions">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('housekeeping.dashboard') }}">Open housekeeping</a>
                        </div>
                    @endcan
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-archive"></div>
                    <div class="module-title">Supplies</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
        </div>
    @endrole

    @role('HRManager')
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-5">
            <div>
                <h2 class="h5 mb-1">HR</h2>
                <p class="text-muted mb-0">Track employee profiles, shifts, and attendance.</p>
            </div>
            <div class="ihms-chips mt-3 mt-md-0">
                <span class="ihms-chip is-info">Team: Active</span>
                <span class="ihms-chip is-alert">Open issues: {{ $openIssuesCount }}</span>
                @can('maintenance.report')
                    <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.create') }}">Report issue</a>
                @endcan
            </div>
        </div>
        <div class="row ihms-module-grid">
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-users"></div>
                    <div class="module-title">Team overview</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-calendar-check-o"></div>
                    <div class="module-title">Schedules & shifts</div>
                    <p class="text-muted">Build weekly schedules and manage coverage.</p>
                    @can('hr.view')
                        <div class="module-actions">
                            <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.dashboard') }}">Open HR module</a>
                        </div>
                    @endcan
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-clock-o"></div>
                    <div class="module-title">Attendance</div>
                    <p class="text-muted mb-0">Coming next.</p>
                </div>
            </div>
        </div>
    @endrole

    @role('Admin')
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 mt-5">
            <div>
                <h2 class="h5 mb-1">Admin</h2>
                <p class="text-muted mb-0">Configure settings, manage access, and review system health.</p>
            </div>
            <div class="ihms-chips mt-3 mt-md-0">
                <span class="ihms-chip is-info">System: Monitoring</span>
                <span class="ihms-chip is-alert">Open issues: {{ $openIssuesCount }}</span>
                @can('maintenance.view')
                    <a class="btn btn-sm btn-outline-secondary" href="{{ route('maintenance.issues.index') }}">Maintenance issues</a>
                @endcan
            </div>
        </div>
        <div class="row ihms-module-grid">
            <div class="col-md-6 col-lg-3">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-cogs"></div>
                    <div class="module-title">Admin panel</div>
                    <p class="text-muted">Core configuration and inventory management.</p>
                    <div class="module-actions">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.dashboard') }}">Open admin</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.rooms.index') }}">Rooms</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.room-types.index') }}">Room types</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-briefcase"></div>
                    <div class="module-title">Operations</div>
                    <p class="text-muted">Front desk, housekeeping, and maintenance.</p>
                    <div class="module-actions">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.dashboard') }}">Front desk</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('housekeeping.assignments.index') }}">Assignments</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('maintenance.issues.index') }}">Issues</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-id-badge"></div>
                    <div class="module-title">People & shifts</div>
                    <p class="text-muted">Employees, schedules, and attendance.</p>
                    <div class="module-actions">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.employees.index') }}">Employees</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.schedule.index') }}">Schedule</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.attendance.index') }}">Attendance</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="ihms-module-card">
                    <div class="module-icon fa fa-line-chart"></div>
                    <div class="module-title">Reports & audit</div>
                    <p class="text-muted">Performance insights and activity logs.</p>
                    <div class="module-actions">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.reports.index') }}">Reports</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.audit-logs.index') }}">Audit logs</a>
                    </div>
                </div>
            </div>
        </div>
    @endrole
@endsection
