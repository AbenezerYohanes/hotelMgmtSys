@extends('layouts.app')

@section('title', 'Edit Employee')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Edit employee</h1>
            <p class="text-muted mb-0">Update employee profile details.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('hr.employees.index') }}">Back to directory</a>
            <a class="btn btn-outline-secondary" href="{{ route('hr.schedule.index') }}">Shift schedule</a>
        </div>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">
            <form method="POST" action="{{ route('hr.employees.update', $employee) }}">
                @csrf
                @method('PUT')

                <h2 class="h6 mb-3">User account</h2>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.input
                            name="user_name"
                            label="User name"
                            :value="$employee->user?->name"
                            autocomplete="name"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <x-form.input
                            name="user_email"
                            type="email"
                            label="User email"
                            :value="$employee->user?->email"
                            autocomplete="email"
                            required
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.select
                            name="user_role"
                            label="Role"
                            :options="$roles->mapWithKeys(fn ($value) => [$value => $value])->all()"
                            :selected="$currentRole"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <x-form.input name="user_password" type="password" label="Reset password (optional)" autocomplete="new-password" />
                        <x-form.input name="user_password_confirmation" type="password" label="Confirm password" autocomplete="new-password" />
                    </div>
                </div>

                <h2 class="h6 mb-3">Employee profile</h2>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.input name="full_name" label="Full name" :value="$employee->full_name" required />
                    </div>
                    <div class="col-md-6">
                        <x-form.input name="position_title" label="Position title" :value="$employee->position_title" required />
                    </div>
                    <div class="col-md-4">
                        <x-form.input name="hire_date" type="date" label="Hire date" :value="$employee->hire_date?->toDateString()" required />
                    </div>
                    <div class="col-md-4">
                        <x-form.input name="phone" label="Phone" :value="$employee->phone" required />
                    </div>
                    <div class="col-md-4">
                        <x-form.input name="address" label="Address" :value="$employee->address" required />
                    </div>
                </div>

                @if ($canManageSalary)
                    <div class="row">
                        <div class="col-md-4">
                            <x-form.input name="salary" type="number" label="Salary" step="0.01" min="0" :value="$employee->salary" />
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
                        @checked(old('is_active', $employee->is_active))
                    >
                    <label class="form-check-label" for="is_active">Active employee</label>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn btn-primary" type="submit">Save changes</button>
                    <a class="btn btn-outline-secondary" href="{{ route('hr.employees.index') }}">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
