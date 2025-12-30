@extends('layouts.app')

@section('title', 'Audit Logs')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Audit logs</h1>
            <p class="text-muted mb-0">Track system activity and key actions.</p>
        </div>
        <a class="btn btn-outline-secondary" href="{{ route('admin.dashboard') }}">Back to admin</a>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('admin.audit-logs.index') }}" class="row g-3 align-items-end">
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
                        name="user_id"
                        label="User"
                        :options="$users->mapWithKeys(fn ($user) => [$user->id => $user->name.' ('.$user->email.')'])->all()"
                        :selected="$userId"
                        placeholder="All users"
                    />
                </div>
                <div class="col-md-3">
                    <x-form.select
                        name="action"
                        label="Action"
                        :options="$actions->mapWithKeys(fn ($value) => [$value => $value])->all()"
                        :selected="$actionFilter"
                        placeholder="All actions"
                    />
                </div>
                <div class="col-md-3 d-flex gap-2">
                    <button class="btn btn-outline-primary" type="submit">Filter</button>
                    <a class="btn btn-outline-secondary" href="{{ route('admin.audit-logs.index') }}">Reset</a>
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
                        <th>User</th>
                        <th>Action</th>
                        <th>Entity</th>
                        <th>Meta</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($logs as $log)
                        <tr>
                            <td>{{ $log->created_at?->format('M d, Y H:i') }}</td>
                            <td>
                                <div class="fw-semibold">{{ $log->user?->name ?? 'System' }}</div>
                                <div class="text-muted small">{{ $log->user?->email ?? '' }}</div>
                            </td>
                            <td>{{ $log->action }}</td>
                            <td>
                                {{ $log->entity_type }}
                                @if ($log->entity_id)
                                    <div class="text-muted small">#{{ $log->entity_id }}</div>
                                @endif
                            </td>
                            <td class="text-muted small">
                                @if ($log->meta)
                                    <code>{{ json_encode($log->meta) }}</code>
                                @else
                                    N/A
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted py-4">No audit logs found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($logs->hasPages())
            <div class="card-footer">
                {{ $logs->links() }}
            </div>
        @endif
    </div>
@endsection
