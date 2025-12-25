<div class="list-group shadow-sm">
    <a class="list-group-item list-group-item-action {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
        Dashboard
    </a>
    @hasanyrole('Guest|Admin')
        <a class="list-group-item list-group-item-action {{ request()->routeIs('guest.bookings.search') ? 'active' : '' }}" href="{{ route('guest.bookings.search') }}">
            Book Rooms
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('guest.bookings.index') ? 'active' : '' }}" href="{{ route('guest.bookings.index') }}">
            My Bookings
        </a>
    @endhasanyrole
    @hasanyrole('FrontDesk|Admin')
        <a class="list-group-item list-group-item-action {{ request()->routeIs('frontdesk.dashboard') ? 'active' : '' }}" href="{{ route('frontdesk.dashboard') }}">
            Front Desk
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('frontdesk.calendar') ? 'active' : '' }}" href="{{ route('frontdesk.calendar') }}">
            Front Desk Calendar
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('frontdesk.bookings.create') ? 'active' : '' }}" href="{{ route('frontdesk.bookings.create') }}">
            Walk-in Booking
        </a>
        @can('housekeeping.assign')
            <a class="list-group-item list-group-item-action {{ request()->routeIs('housekeeping.assignments.*') ? 'active' : '' }}" href="{{ route('housekeeping.assignments.index') }}">
                Housekeeping Assignments
            </a>
        @endcan
        @can('maintenance.view')
            <a class="list-group-item list-group-item-action {{ request()->routeIs('maintenance.issues.index') ? 'active' : '' }}" href="{{ route('maintenance.issues.index') }}">
                Maintenance Issues
            </a>
        @endcan
    @endhasanyrole
    @can('maintenance.report')
        <a class="list-group-item list-group-item-action {{ request()->routeIs('maintenance.issues.create') ? 'active' : '' }}" href="{{ route('maintenance.issues.create') }}">
            Report Issue
        </a>
    @endcan
    @hasanyrole('Housekeeper|Admin')
        <a class="list-group-item list-group-item-action {{ request()->routeIs('housekeeping.dashboard') ? 'active' : '' }}" href="{{ route('housekeeping.dashboard') }}">
            Housekeeping
        </a>
    @endhasanyrole
    @hasanyrole('HRManager|Admin')
        <a class="list-group-item list-group-item-action {{ request()->routeIs('hr.*') ? 'active' : '' }}" href="{{ route('hr.dashboard') }}">
            HR Manager
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('hr.schedule.*') ? 'active' : '' }}" href="{{ route('hr.schedule.index') }}">
            Shift Schedule
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('hr.attendance.*') ? 'active' : '' }}" href="{{ route('hr.attendance.index') }}">
            Attendance
        </a>
    @endhasanyrole
    @role('Admin')
        <a class="list-group-item list-group-item-action {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">
            Admin Dashboard
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('admin.reports.*') ? 'active' : '' }}" href="{{ route('admin.reports.index') }}">
            Reports
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('admin.audit-logs.*') ? 'active' : '' }}" href="{{ route('admin.audit-logs.index') }}">
            Audit Logs
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('admin.room-types.*') ? 'active' : '' }}" href="{{ route('admin.room-types.index') }}">
            Room Types
        </a>
        <a class="list-group-item list-group-item-action {{ request()->routeIs('admin.rooms.*') ? 'active' : '' }}" href="{{ route('admin.rooms.index') }}">
            Rooms
        </a>
    @endrole
</div>
