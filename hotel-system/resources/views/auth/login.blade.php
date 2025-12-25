@extends('layouts.guest')

@section('title', 'Sign in')

@section('content')
    <h1 class="h4 mb-3">Welcome back</h1>
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <x-form.input
            name="email"
            type="email"
            label="Email"
            autocomplete="username"
            required
            autofocus
        />
        <x-form.input
            name="password"
            type="password"
            label="Password"
            autocomplete="current-password"
            required
        />
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="form-check">
                <input class="form-check-input" id="remember" type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}>
                <label class="form-check-label" for="remember">Remember me</label>
            </div>
            <a href="{{ route('password.request') }}">Forgot password?</a>
        </div>
        <button class="btn btn-primary w-100" type="submit">Sign in</button>
    </form>
    <p class="text-center mt-3 mb-0">
        No account?
        <a href="{{ route('register') }}">Create one</a>
    </p>
@endsection
