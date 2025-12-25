<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'Hotel System'))</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body class="bg-light">
    @include('partials.topbar')

    <main class="py-4">
        <div class="container">
            <x-flash />
            <x-validation-errors />

            <div class="row">
                <aside class="col-lg-3 col-xl-2 mb-4">
                    @include('partials.sidebar')
                </aside>
                <div class="col-lg-9 col-xl-10">
                    @yield('content')
                </div>
            </div>
        </div>
    </main>

    @stack('scripts')
</body>
</html>
