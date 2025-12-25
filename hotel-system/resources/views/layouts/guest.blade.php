<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'Hotel System'))</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="text-center mb-4">
            <a class="text-decoration-none fw-semibold text-dark" href="{{ url('/') }}">
                {{ config('app.name', 'Hotel System') }}
            </a>
        </div>
        <div class="row justify-content-center">
            <div class="col-sm-10 col-md-8 col-lg-5">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <x-flash />
                        <x-validation-errors />

                        @yield('content')
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
