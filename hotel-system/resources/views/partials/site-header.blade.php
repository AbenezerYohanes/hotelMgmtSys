<header role="banner">
    <nav class="navbar navbar-expand-md navbar-dark bg-light">
        <div class="container-fluid ihms-dashboard-container">
            <button class="ihms-sidebar-toggle" type="button" data-ihms-sidebar-toggle aria-label="Toggle sidebar">
                <span class="fa fa-bars"></span>
            </button>
            <a class="navbar-brand" href="{{ route('home') }}">Heaven hotel</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse navbar-light" id="mainNav">
                <ul class="navbar-nav ml-auto pl-lg-5 pl-0">
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}" href="{{ route('home') }}">
                            Home
                        </a>
                    </li>
                    @guest
                        <li class="nav-item">
                            <a class="nav-link" href="#quick-book">Book Rooms</a>
                        </li>
                    @endguest
                    @hasanyrole('Guest|Admin')
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('guest.bookings.search') ? 'active' : '' }}"
                                href="{{ route('guest.bookings.search') }}">
                                Book Rooms
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('guest.bookings.index') ? 'active' : '' }}"
                                href="{{ route('guest.bookings.index') }}">
                                My Bookings
                            </a>
                        </li>
                    @endhasanyrole
                    @auth
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}"
                                href="{{ route('dashboard') }}">
                                Dashboard
                            </a>
                        </li>
                        @php
                            $hasStaffModules = auth()->user()->hasAnyRole(['FrontDesk', 'Housekeeper', 'HRManager', 'Admin'])
                                || auth()->user()->can('maintenance.report')
                                || auth()->user()->can('maintenance.view')
                                || auth()->user()->can('housekeeping.assign');
                        @endphp
                        @if ($hasStaffModules)
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="modulesDropdown" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                    Modules
                                </a>
                                <div class="dropdown-menu" aria-labelledby="modulesDropdown">
                                    @hasanyrole('FrontDesk|Admin')
                                        <a class="dropdown-item" href="{{ route('frontdesk.dashboard') }}">Front Desk</a>
                                        <a class="dropdown-item" href="{{ route('frontdesk.calendar') }}">Front Desk Calendar</a>
                                        <a class="dropdown-item" href="{{ route('frontdesk.bookings.create') }}">Walk-in Booking</a>
                                    @endhasanyrole
                                    @can('maintenance.report')
                                        <a class="dropdown-item" href="{{ route('maintenance.issues.create') }}">Report Issue</a>
                                    @endcan
                                    @hasanyrole('Housekeeper|Admin')
                                        <a class="dropdown-item" href="{{ route('housekeeping.dashboard') }}">Housekeeping</a>
                                    @endhasanyrole
                                    @hasanyrole('HRManager|Admin')
                                        <a class="dropdown-item" href="{{ route('hr.dashboard') }}">HR Manager</a>
                                        <a class="dropdown-item" href="{{ route('hr.schedule.index') }}">Shift Schedule</a>
                                        <a class="dropdown-item" href="{{ route('hr.attendance.index') }}">Attendance</a>
                                    @endhasanyrole
                                    @role('Admin')
                                        <a class="dropdown-item" href="{{ route('admin.dashboard') }}">Admin Dashboard</a>
                                        <a class="dropdown-item" href="{{ route('admin.bookings.index') }}">Bookings</a>
                                        <a class="dropdown-item" href="{{ route('admin.reports.index') }}">Reports</a>
                                        <a class="dropdown-item" href="{{ route('admin.audit-logs.index') }}">Audit Logs</a>
                                        <a class="dropdown-item" href="{{ route('admin.room-types.index') }}">Room Types</a>
                                        <a class="dropdown-item" href="{{ route('admin.rooms.index') }}">Rooms</a>
                                    @endrole
                                </div>
                            </li>
                        @endif
                        @php
                            $roleLabel = auth()->user()->getRoleNames()->implode(', ') ?: 'User';
                        @endphp
                        <li class="nav-item dropdown ihms-account">
                            <a class="nav-link dropdown-toggle ihms-account-toggle" href="#" id="accountDropdown"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="ihms-account-name">{{ auth()->user()->name }}</span>
                                <span class="ihms-account-role">{{ $roleLabel }}</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right ihms-account-menu" aria-labelledby="accountDropdown">
                                <span class="dropdown-item-text small text-muted">
                                    Signed in as {{ auth()->user()->email }}
                                </span>
                                <div class="dropdown-divider"></div>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button class="dropdown-item ihms-signout" type="submit">Sign out</button>
                                </form>
                            </div>
                        </li>
                    @endauth
                    <li class="nav-item cta">
                        @guest
                            <a class="nav-link" href="{{ route('login') }}"><span>Log In</span></a>
                        @else
                            <a class="nav-link" href="{{ route('dashboard') }}"><span>Dashboard</span></a>
                        @endguest
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
