<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @include('partials.site-head')
</head>
<body class="ihms-with-header ihms-no-sidebar ihms-fullwidth @yield('body-class')">
    <div class="ihms-content">
        @include('partials.site-header')

        @hasSection('hero')
            @yield('hero')
        @endif

    <main class="site-section ihms-auth">
        <div class="container-fluid ihms-dashboard-container">
            <div class="row justify-content-center align-items-center ihms-auth-row">
                <div class="col-lg-6 col-xl-5">
                    <div class="sidebar-box">
                        <x-flash />
                            <x-validation-errors />

                            @yield('content')
                        </div>
                    </div>
                </div>
            </div>
        </main>

        @include('partials.site-footer')
    </div>

    @include('partials.site-scripts')
</body>
</html>
