@extends('layouts.app')

@section('title', 'Attendance')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Attendance</h1>
            <p class="text-muted mb-0">Review employee attendance by date range.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('hr.employees.index') }}">Employee directory</a>
            <a class="btn btn-outline-secondary" href="{{ route('hr.schedule.index') }}">Shift schedule</a>
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('hr.attendance.index') }}" class="row g-3 align-items-end">
                <div class="col-md-3">
                    <x-form.input
                        name="start_date"
                        type="date"
                        label="Start date"
                        :value="$startDate"
                        required
                    />
                </div>
                <div class="col-md-3">
                    <x-form.input
                        name="end_date"
                        type="date"
                        label="End date"
                        :value="$endDate"
                        required
                    />
                </div>
                <div class="col-md-4">
                    <x-form.select
                        name="employee_id"
                        label="Employee"
                        :options="$employees->mapWithKeys(fn ($employee) => [$employee->id => $employee->full_name])->all()"
                        :selected="$employeeId"
                        placeholder="All employees"
                    />
                </div>
                <div class="col-md-2 d-flex gap-2">
                    <button class="btn btn-outline-primary" type="submit">Filter</button>
                    <a class="btn btn-outline-secondary" href="{{ route('hr.attendance.index') }}">Reset</a>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Role</th>
                        <th>Clock in</th>
                        <th>Clock out</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($attendances as $attendance)
                        @php
                            $employee = $attendance->employee;
                            $user = $employee?->user;
                            $role = $user?->getRoleNames()->implode(', ') ?: ($user?->role ?? 'N/A');
                        @endphp
                        <tr>
                            <td>{{ $attendance->date?->format('M d, Y') }}</td>
                            <td>
                                <div class="fw-semibold">{{ $employee?->full_name ?? 'N/A' }}</div>
                                <div class="text-muted small">{{ $user?->email ?? '' }}</div>
                            </td>
                            <td>{{ $role }}</td>
                            <td>{{ $attendance->clock_in_time ?? 'N/A' }}</td>
                            <td>{{ $attendance->clock_out_time ?? 'N/A' }}</td>
                            <td>{{ ucfirst($attendance->status ?? 'N/A') }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No attendance records found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($attendances->hasPages())
            <div class="card-footer">
                {{ $attendances->links() }}
            </div>
        @endif
    </div>
@endsection
