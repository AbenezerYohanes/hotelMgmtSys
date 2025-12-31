@extends('layouts.guest')

@section('title', 'Create account')

@section('content')
    <h1 class="h4 mb-3">Create your account</h1>
    <p class="text-muted small mb-4">New accounts are created with the Guest role.</p>

    <form method="POST" action="{{ route('register') }}">
        @csrf
        <x-form.input
            name="name"
            type="text"
            label="Name"
            autocomplete="name"
            required
            autofocus
        />
        <x-form.input
            name="email"
            type="email"
            label="Email"
            autocomplete="username"
            required
        />
        <x-form.input
            name="password"
            type="password"
            label="Password"
            autocomplete="new-password"
            required
        />
        <x-form.input
            name="password_confirmation"
            type="password"
            label="Confirm password"
            autocomplete="new-password"
            required
        />
        <button class="btn btn-primary w-100" type="submit">Create account</button>
    </form>
    <p class="text-center mt-3 mb-0">
        Already have an account?
        <a href="{{ route('login') }}">Sign in</a>
    </p>
@endsection
