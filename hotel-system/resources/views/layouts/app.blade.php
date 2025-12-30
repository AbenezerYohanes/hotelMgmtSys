<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @include('partials.site-head')
</head>
<body class="ihms-with-header ihms-with-sidebar ihms-fullwidth @yield('body-class')">
    <div class="ihms-shell">
        <aside class="ihms-sidebar-panel">
            @include('partials.sidebar')
        </aside>
        <div class="ihms-sidebar-overlay"></div>

        <div class="ihms-content">
            @include('partials.site-header')

            @hasSection('hero')
                @yield('hero')
            @endif

            <main class="site-section @yield('main-class')">
                <div class="@yield('container-class', 'container-fluid ihms-dashboard-container')">
                    <x-flash />
                    <x-validation-errors />

                    @yield('content')
                </div>
            </main>

            @include('partials.site-footer')
        </div>
    </div>

    @include('partials.site-scripts')
</body>
</html>
