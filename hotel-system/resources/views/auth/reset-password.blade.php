@extends('layouts.guest')

@section('title', 'Reset password')

@section('content')
    <h1 class="h4 mb-3">Set a new password</h1>

    <form method="POST" action="{{ route('password.store') }}">
        @csrf
        <input type="hidden" name="token" value="{{ $request->route('token') }}">

        <x-form.input
            name="email"
            type="email"
            label="Email"
            :value="$request->email"
            autocomplete="username"
            required
            autofocus
        />
        <x-form.input
            name="password"
            type="password"
            label="New password"
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

        <button class="btn btn-primary w-100" type="submit">Reset password</button>
    </form>
@endsection
