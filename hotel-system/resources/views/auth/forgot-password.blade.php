@extends('layouts.guest')

@section('title', 'Forgot password')

@section('content')
    <h1 class="h4 mb-3">Forgot your password?</h1>
    <p class="text-muted mb-4">Enter your email and we will send a reset link.</p>

    <form method="POST" action="{{ route('password.email') }}">
        @csrf
        <x-form.input
            name="email"
            type="email"
            label="Email"
            required
            autofocus
        />
        <button class="btn btn-primary w-100" type="submit">Email reset link</button>
    </form>
    <p class="text-center mt-3 mb-0">
        <a href="{{ route('login') }}">Back to sign in</a>
    </p>
@endsection
