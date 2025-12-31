@php
    $guestOpen = request()->routeIs('guest.bookings.*');
    $frontDeskOpen = request()->routeIs('frontdesk.*');
    $housekeepingOpen = request()->routeIs('housekeeping.*');
    $maintenanceOpen = request()->routeIs('maintenance.*');
    $hrOpen = request()->routeIs('hr.*');
    $adminOpen = request()->routeIs('admin.*');
@endphp

<div class="sidebar-box ihms-sidebar">
    <div class="sidebar-title">Navigation</div>
    <a class="sidebar-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
        <span class="fa fa-tachometer"></span>
        <span class="sidebar-label">Overview</span>
    </a>

    @role('Admin')
        <div class="sidebar-group mt-3">
            <a class="sidebar-toggle" data-toggle="collapse" href="#navAdmin" role="button"
                aria-expanded="{{ $adminOpen ? 'true' : 'false' }}" aria-controls="navAdmin">
                <span><span class="fa fa-shield"></span> <span class="sidebar-label">Admin</span></span>
                <span class="fa fa-angle-down toggle-icon"></span>
            </a>
            <div class="collapse {{ $adminOpen ? 'show' : '' }}" id="navAdmin">
                <ul class="sidebar-links">
                    <li>
                        <a class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}"
                            href="{{ route('admin.dashboard') }}">
                            <span class="fa fa-cogs"></span>
                            <span class="sidebar-label">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('admin.bookings.*') ? 'active' : '' }}"
                            href="{{ route('admin.bookings.index') }}">
                            <span class="fa fa-book"></span>
                            <span class="sidebar-label">Bookings</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('admin.room-types.*') ? 'active' : '' }}"
                            href="{{ route('admin.room-types.index') }}">
                            <span class="fa fa-th-large"></span>
                            <span class="sidebar-label">Room Types</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('admin.rooms.*') ? 'active' : '' }}"
                            href="{{ route('admin.rooms.index') }}">
                            <span class="fa fa-key"></span>
                            <span class="sidebar-label">Rooms</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('admin.reports.*') ? 'active' : '' }}"
                            href="{{ route('admin.reports.index') }}">
                            <span class="fa fa-line-chart"></span>
                            <span class="sidebar-label">Reports</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('admin.audit-logs.*') ? 'active' : '' }}"
                            href="{{ route('admin.audit-logs.index') }}">
                            <span class="fa fa-list-alt"></span>
                            <span class="sidebar-label">Audit Logs</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    @endrole

    @hasanyrole('Guest|Admin')
        <div class="sidebar-group mt-3">
            <a class="sidebar-toggle" data-toggle="collapse" href="#navGuest" role="button"
                aria-expanded="{{ $guestOpen ? 'true' : 'false' }}" aria-controls="navGuest">
                <span><span class="fa fa-bed"></span> <span class="sidebar-label">Guest Services</span></span>
                <span class="fa fa-angle-down toggle-icon"></span>
            </a>
            <div class="collapse {{ $guestOpen ? 'show' : '' }}" id="navGuest">
                <ul class="sidebar-links">
                    <li>
                        <a class="{{ request()->routeIs('guest.bookings.search') ? 'active' : '' }}"
                            href="{{ route('guest.bookings.search') }}">
                            <span class="fa fa-search"></span>
                            <span class="sidebar-label">Book Rooms</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('guest.bookings.index') ? 'active' : '' }}"
                            href="{{ route('guest.bookings.index') }}">
                            <span class="fa fa-ticket"></span>
                            <span class="sidebar-label">My Bookings</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    @endhasanyrole

    @hasanyrole('FrontDesk|Admin')
        <div class="sidebar-group mt-3">
            <a class="sidebar-toggle" data-toggle="collapse" href="#navFrontDesk" role="button"
                aria-expanded="{{ $frontDeskOpen ? 'true' : 'false' }}" aria-controls="navFrontDesk">
                <span><span class="fa fa-bell"></span> <span class="sidebar-label">Front Desk</span></span>
                <span class="fa fa-angle-down toggle-icon"></span>
            </a>
            <div class="collapse {{ $frontDeskOpen ? 'show' : '' }}" id="navFrontDesk">
                <ul class="sidebar-links">
                    <li>
                        <a class="{{ request()->routeIs('frontdesk.dashboard') ? 'active' : '' }}"
                            href="{{ route('frontdesk.dashboard') }}">
                            <span class="fa fa-desktop"></span>
                            <span class="sidebar-label">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('frontdesk.calendar') ? 'active' : '' }}"
                            href="{{ route('frontdesk.calendar') }}">
                            <span class="fa fa-calendar"></span>
                            <span class="sidebar-label">Calendar</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('frontdesk.bookings.create') ? 'active' : '' }}"
                            href="{{ route('frontdesk.bookings.create') }}">
                            <span class="fa fa-plus"></span>
                            <span class="sidebar-label">Walk-in Booking</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    @endhasanyrole

    @if (auth()->user()->hasAnyRole(['Housekeeper', 'Admin']) || auth()->user()->can('housekeeping.assign'))
        <div class="sidebar-group mt-3">
            <a class="sidebar-toggle" data-toggle="collapse" href="#navHousekeeping" role="button"
                aria-expanded="{{ $housekeepingOpen ? 'true' : 'false' }}" aria-controls="navHousekeeping">
                <span><span class="fa fa-tasks"></span> <span class="sidebar-label">Housekeeping</span></span>
                <span class="fa fa-angle-down toggle-icon"></span>
            </a>
            <div class="collapse {{ $housekeepingOpen ? 'show' : '' }}" id="navHousekeeping">
                <ul class="sidebar-links">
                    @hasanyrole('Housekeeper|Admin')
                        <li>
                            <a class="{{ request()->routeIs('housekeeping.dashboard') ? 'active' : '' }}"
                                href="{{ route('housekeeping.dashboard') }}">
                                <span class="fa fa-check-square-o"></span>
                                <span class="sidebar-label">Room Status</span>
                            </a>
                        </li>
                    @endhasanyrole
                    @can('housekeeping.assign')
                        <li>
                            <a class="{{ request()->routeIs('housekeeping.assignments.*') ? 'active' : '' }}"
                                href="{{ route('housekeeping.assignments.index') }}">
                                <span class="fa fa-user-plus"></span>
                                <span class="sidebar-label">Assignments</span>
                            </a>
                        </li>
                    @endcan
                </ul>
            </div>
        </div>
    @endif

    @if (auth()->user()->can('maintenance.report') || auth()->user()->can('maintenance.view'))
        <div class="sidebar-group mt-3">
            <a class="sidebar-toggle" data-toggle="collapse" href="#navMaintenance" role="button"
                aria-expanded="{{ $maintenanceOpen ? 'true' : 'false' }}" aria-controls="navMaintenance">
                <span><span class="fa fa-wrench"></span> <span class="sidebar-label">Maintenance</span></span>
                <span class="fa fa-angle-down toggle-icon"></span>
            </a>
            <div class="collapse {{ $maintenanceOpen ? 'show' : '' }}" id="navMaintenance">
                <ul class="sidebar-links">
                    @can('maintenance.view')
                        <li>
                            <a class="{{ request()->routeIs('maintenance.issues.index') ? 'active' : '' }}"
                                href="{{ route('maintenance.issues.index') }}">
                            <span class="fa fa-exclamation-triangle"></span>
                            <span class="sidebar-label">Issues</span>
                        </a>
                    </li>
                @endcan
                @can('maintenance.report')
                    <li>
                        <a class="{{ request()->routeIs('maintenance.issues.create') ? 'active' : '' }}"
                            href="{{ route('maintenance.issues.create') }}">
                            <span class="fa fa-plus-circle"></span>
                            <span class="sidebar-label">Report Issue</span>
                        </a>
                    </li>
                @endcan
            </ul>
        </div>
    </div>
    @endif

    @hasanyrole('HRManager|Admin')
        <div class="sidebar-group mt-3">
            <a class="sidebar-toggle" data-toggle="collapse" href="#navHR" role="button"
                aria-expanded="{{ $hrOpen ? 'true' : 'false' }}" aria-controls="navHR">
                <span><span class="fa fa-users"></span> <span class="sidebar-label">HR</span></span>
                <span class="fa fa-angle-down toggle-icon"></span>
            </a>
            <div class="collapse {{ $hrOpen ? 'show' : '' }}" id="navHR">
                <ul class="sidebar-links">
                    <li>
                        <a class="{{ request()->routeIs('hr.dashboard') ? 'active' : '' }}"
                            href="{{ route('hr.dashboard') }}">
                            <span class="fa fa-address-book"></span>
                            <span class="sidebar-label">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('hr.employees.*') ? 'active' : '' }}"
                            href="{{ route('hr.employees.index') }}">
                            <span class="fa fa-id-badge"></span>
                            <span class="sidebar-label">Employees</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('hr.schedule.*') ? 'active' : '' }}"
                            href="{{ route('hr.schedule.index') }}">
                            <span class="fa fa-calendar-check-o"></span>
                            <span class="sidebar-label">Schedule</span>
                        </a>
                    </li>
                    <li>
                        <a class="{{ request()->routeIs('hr.attendance.*') ? 'active' : '' }}"
                            href="{{ route('hr.attendance.index') }}">
                            <span class="fa fa-clock-o"></span>
                            <span class="sidebar-label">Attendance</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    @endhasanyrole

</div>

