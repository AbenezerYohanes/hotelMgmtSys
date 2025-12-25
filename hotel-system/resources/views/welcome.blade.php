<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Hotel System') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="{{ url('/') }}">{{ config('app.name', 'Hotel System') }}</a>
            <div class="ms-auto">
                @auth
                    <a class="btn btn-outline-light btn-sm" href="{{ route('dashboard') }}">Dashboard</a>
                @else
                    <a class="btn btn-outline-light btn-sm me-2" href="{{ route('login') }}">Sign in</a>
                    <a class="btn btn-primary btn-sm" href="{{ route('register') }}">Register</a>
                @endauth
            </div>
        </div>
    </nav>

    <main class="container py-5">
        <div class="row align-items-center g-4">
            <div class="col-lg-6">
                <h1 class="display-5 fw-semibold">Hotel Management System</h1>
                <p class="lead text-muted">
                    Manage stays and book rooms with a Guest account.
                </p>
                <div class="d-flex flex-wrap gap-2">
                    @auth
                        <a class="btn btn-primary" href="{{ route('dashboard') }}">Go to dashboard</a>
                    @else
                        <a class="btn btn-primary" href="{{ route('register') }}">Create guest account</a>
                        <a class="btn btn-outline-secondary" href="{{ route('login') }}">Sign in</a>
                    @endauth
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="h5">Guest booking ready</h2>
                        <p class="mb-0 text-muted">
                            Guest users can register and book rooms immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
