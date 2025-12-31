@extends('layouts.app')

@section('title', 'Employee Directory')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Employee directory</h1>
            <p class="text-muted mb-0">Manage employee profiles and roles.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('hr.schedule.index') }}">Shift schedule</a>
            <a class="btn btn-outline-secondary" href="{{ route('hr.attendance.index') }}">Attendance</a>
            @can('hr.manage')
                <a class="btn btn-primary" href="{{ route('hr.employees.create') }}">Add employee</a>
            @endcan
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('hr.employees.index') }}" class="row g-3 align-items-end">
                <div class="col-md-3">
                    <x-form.select
                        name="active"
                        label="Status"
                        :options="['active' => 'Active', 'inactive' => 'Inactive']"
                        :selected="$active !== 'all' ? $active : null"
                        placeholder="All statuses"
                    />
                </div>
                <div class="col-md-4">
                    <x-form.select
                        name="position"
                        label="Position"
                        :options="$positions->mapWithKeys(fn ($value) => [$value => $value])->all()"
                        :selected="$position !== 'all' ? $position : null"
                        placeholder="All positions"
                    />
                </div>
                <div class="col-md-3">
                    <x-form.select
                        name="role"
                        label="Role"
                        :options="$roles->mapWithKeys(fn ($value) => [$value => $value])->all()"
                        :selected="$role !== 'all' ? $role : null"
                        placeholder="All roles"
                    />
                </div>
                <div class="col-md-2 d-flex gap-2">
                    <button class="btn btn-outline-primary" type="submit">Filter</button>
                    <a class="btn btn-outline-secondary" href="{{ route('hr.employees.index') }}">Reset</a>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Employee</th>
                        <th>Role</th>
                        <th>Position</th>
                        <th>Phone</th>
                        <th>Status</th>
                        @if ($canManageSalary)
                            <th class="text-end">Salary</th>
                        @endif
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($employees as $employee)
                        @php
                            $user = $employee->user;
                            $roleNames = $user?->getRoleNames()->implode(', ') ?: ($user?->role ?? 'N/A');
                            $statusClass = $employee->is_active ? 'bg-success' : 'bg-secondary';
                        @endphp
                        <tr>
                            <td>
                                <div class="fw-semibold">{{ $employee->full_name }}</div>
                                <div class="text-muted small">{{ $user?->email ?? 'N/A' }}</div>
                            </td>
                            <td>{{ $roleNames }}</td>
                            <td>{{ $employee->position_title }}</td>
                            <td>{{ $employee->phone }}</td>
                            <td>
                                <span class="badge {{ $statusClass }}">
                                    {{ $employee->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            @if ($canManageSalary)
                                <td class="text-end">
                                    {{ $employee->salary !== null ? number_format($employee->salary, 2) : 'N/A' }}
                                </td>
                            @endif
                            <td class="text-end">
                                @can('hr.manage')
                                    <div class="d-inline-flex flex-wrap gap-2 justify-content-end">
                                        <a class="btn btn-sm btn-outline-primary" href="{{ route('hr.employees.edit', $employee) }}">Edit</a>
                                        <form method="POST" action="{{ route('hr.employees.destroy', $employee) }}" onsubmit="return confirm('Delete this employee?');">
                                            @csrf
                                            @method('DELETE')
                                            <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                                        </form>
                                    </div>
                                @else
                                    <span class="text-muted small">No actions</span>
                                @endcan
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="{{ $canManageSalary ? 7 : 6 }}" class="text-center text-muted py-4">
                                No employees found.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($employees->hasPages())
            <div class="card-footer">
                {{ $employees->links() }}
            </div>
        @endif
    </div>
@endsection
