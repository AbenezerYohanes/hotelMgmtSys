@extends('layouts.app')

@section('title', 'Shift Schedule')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Shift schedule</h1>
            <p class="text-muted mb-0">Assign employees to Morning, Evening, and Night shifts.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('hr.employees.index') }}">Employee directory</a>
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('hr.schedule.index') }}" class="row g-3 align-items-end">
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
                <div class="col-md-3">
                    <x-form.select
                        name="employee_id"
                        label="Employee"
                        :options="$employees->mapWithKeys(fn ($employee) => [$employee->id => $employee->full_name])->all()"
                        :selected="$employeeId"
                        placeholder="All employees"
                    />
                </div>
                <div class="col-md-3">
                    <x-form.select
                        name="shift_id"
                        label="Shift"
                        :options="$shifts->mapWithKeys(fn ($shift) => [$shift->id => $shift->name])->all()"
                        :selected="$shiftId"
                        placeholder="All shifts"
                    />
                </div>
                <div class="col-md-3">
                    <x-form.select
                        name="active"
                        label="Employee status"
                        :options="['active' => 'Active', 'inactive' => 'Inactive']"
                        :selected="$active !== 'all' ? $active : null"
                        placeholder="All statuses"
                    />
                </div>
                <div class="col-md-3 d-flex gap-2">
                    <button class="btn btn-outline-primary" type="submit">Filter</button>
                    <a class="btn btn-outline-secondary" href="{{ route('hr.schedule.index') }}">Reset</a>
                </div>
            </form>
        </div>
    </div>

    @if ($canManage)
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h2 class="h6 mb-3">Assign shift</h2>
                <form method="POST" action="{{ route('hr.schedule.store') }}" class="row g-3">
                    @csrf
                    <div class="col-md-4">
                        <x-form.select
                            name="employee_id"
                            label="Employee"
                        :options="$assignableEmployees->mapWithKeys(fn ($employee) => [$employee->id => $employee->full_name])->all()"
                            placeholder="Select an employee"
                            required
                        />
                    </div>
                    <div class="col-md-4">
                        <x-form.select
                            name="shift_id"
                            label="Shift"
                            :options="$shifts->mapWithKeys(fn ($shift) => [$shift->id => $shift->name.' ('.$shift->start_time.' - '.$shift->end_time.')'])->all()"
                            placeholder="Select a shift"
                            required
                        />
                    </div>
                    <div class="col-md-4">
                        <x-form.input
                            name="work_date"
                            type="date"
                            label="Work date"
                            :value="old('work_date', $startDate)"
                            required
                        />
                    </div>
                    <div class="col-12">
                        <button class="btn btn-primary" type="submit">Assign shift</button>
                    </div>
                </form>
            </div>
        </div>
    @endif

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Role</th>
                        <th>Shift</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($assignments as $assignment)
                        @php
                            $employee = $assignment->employee;
                            $user = $employee?->user;
                            $roles = $user?->getRoleNames()->implode(', ') ?: ($user?->role ?? 'N/A');
                            $statusClass = $employee?->is_active ? 'bg-success' : 'bg-secondary';
                        @endphp
                        <tr>
                            <td>{{ $assignment->work_date?->format('M d, Y') }}</td>
                            <td>
                                <div class="fw-semibold">{{ $employee?->full_name ?? 'N/A' }}</div>
                                <div class="text-muted small">{{ $user?->email ?? '' }}</div>
                            </td>
                            <td>{{ $roles }}</td>
                            <td>
                                <div class="fw-semibold">{{ $assignment->shift?->name ?? 'N/A' }}</div>
                                <div class="text-muted small">
                                    {{ $assignment->shift?->start_time }} - {{ $assignment->shift?->end_time }}
                                </div>
                            </td>
                            <td>
                                <span class="badge {{ $statusClass }}">
                                    {{ $employee?->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="text-end">
                                @if ($canManage)
                                    <div class="d-inline-flex flex-wrap gap-2 justify-content-end">
                                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.schedule.edit', $assignment) }}">Edit</a>
                                        <form method="POST" action="{{ route('hr.schedule.destroy', $assignment) }}" onsubmit="return confirm('Remove this assignment?');">
                                            @csrf
                                            @method('DELETE')
                                            <button class="btn btn-sm btn-outline-danger" type="submit">Remove</button>
                                        </form>
                                    </div>
                                @else
                                    <span class="text-muted small">No actions</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No assignments found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($assignments->hasPages())
            <div class="card-footer">
                {{ $assignments->links() }}
            </div>
        @endif
    </div>
@endsection
