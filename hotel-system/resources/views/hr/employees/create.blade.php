@extends('layouts.app')

@section('title', 'Add Employee')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Add employee</h1>
            <p class="text-muted mb-0">Create a new employee profile with a user account.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('hr.employees.index') }}">Back to directory</a>
            <a class="btn btn-outline-secondary" href="{{ route('hr.schedule.index') }}">Shift schedule</a>
        </div>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">
            <form method="POST" action="{{ route('hr.employees.store') }}">
                @csrf

                <h2 class="h6 mb-3">User account</h2>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.select
                            name="user_role"
                            label="Role"
                            :options="$roles->mapWithKeys(fn ($value) => [$value => $value])->all()"
                            :selected="old('user_role')"
                            required
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.input name="user_name" label="User name" autocomplete="name" />
                    </div>
                    <div class="col-md-6">
                        <x-form.input name="user_email" type="email" label="User email" autocomplete="email" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.input name="user_password" type="password" label="Password (optional)" autocomplete="new-password" />
                    </div>
                    <div class="col-md-6">
                        <x-form.input name="user_password_confirmation" type="password" label="Confirm password" autocomplete="new-password" />
                    </div>
                </div>
                <p class="text-muted small mb-4">
                    Leaving the password blank uses the default password {{ $defaultPassword }}.
                </p>

                <h2 class="h6 mb-3">Employee profile</h2>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.input name="full_name" label="Full name" required />
                    </div>
                    <div class="col-md-6">
                        <x-form.input name="position_title" label="Position title" required />
                    </div>
                    <div class="col-md-4">
                        <x-form.input name="hire_date" type="date" label="Hire date" required />
                    </div>
                    <div class="col-md-4">
                        <x-form.input name="phone" label="Phone" required />
                    </div>
                    <div class="col-md-4">
                        <x-form.input name="address" label="Address" required />
                    </div>
                </div>

                @if ($canManageSalary)
                    <div class="row">
                        <div class="col-md-4">
                            <x-form.input name="salary" type="number" label="Salary" step="0.01" min="0" />
                        </div>
                    </div>
                @endif

                <div class="form-check mb-4">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        value="1"
                        @checked(old('is_active', true))
                    >
                    <label class="form-check-label" for="is_active">Active employee</label>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn btn-primary" type="submit">Create employee</button>
                    <a class="btn btn-outline-secondary" href="{{ route('hr.employees.index') }}">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
