@extends('layouts.app')

@section('title', 'Admin')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Admin</h1>
            <p class="text-muted mb-0">Oversee operations, inventory, staff, and reporting.</p>
        </div>
    </div>

    <div class="row g-3">
        <div class="col-md-6 col-xl-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">Rooms & pricing</h2>
                    <p class="text-muted">Manage inventory, types, and pricing rules.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.rooms.index') }}">Rooms</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.room-types.index') }}">Room types</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">Front desk</h2>
                    <p class="text-muted">Monitor arrivals, calendar, and walk-ins.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.dashboard') }}">Dashboard</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.calendar') }}">Calendar</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.bookings.index') }}">Bookings</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('frontdesk.bookings.create') }}">Walk-in</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">Housekeeping</h2>
                    <p class="text-muted">Track assignments and daily room status.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('housekeeping.dashboard') }}">Dashboard</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('housekeeping.assignments.index') }}">Assignments</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">Maintenance</h2>
                    <p class="text-muted">Review open issues and triage requests.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('maintenance.issues.index') }}">Issues</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('maintenance.issues.create') }}">Report issue</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">HR operations</h2>
                    <p class="text-muted">Manage employees, shifts, and attendance.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.employees.index') }}">Employees</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.schedule.index') }}">Shift schedule</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.attendance.index') }}">Attendance</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">Reports & audit</h2>
                    <p class="text-muted">Review performance and system activity.</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.reports.index') }}">Reports</a>
                        <a class="btn btn-sm btn-outline-primary" href="{{ route('admin.audit-logs.index') }}">Audit logs</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

