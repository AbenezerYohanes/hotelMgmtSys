@extends('layouts.app')

@section('title', 'Maintenance Issues')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Maintenance issues</h1>
            <p class="text-muted mb-0">Track reported issues and resolution progress.</p>
        </div>
        <div class="d-flex flex-wrap gap-2 align-items-center">
            <span class="badge bg-info text-dark">Open issues: {{ $openIssuesCount }}</span>
            @can('maintenance.report')
                <a class="btn btn-outline-secondary" href="{{ route('maintenance.issues.create') }}">Report issue</a>
            @endcan
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('maintenance.issues.index') }}" class="row g-3 align-items-end">
                <div class="col-md-4">
                    <x-form.select
                        name="status"
                        label="Status"
                        :options="collect($statuses)->mapWithKeys(fn ($value) => [$value => ucfirst(str_replace('_', ' ', $value))])->all()"
                        :selected="$status !== 'all' ? $status : null"
                        placeholder="All statuses"
                    />
                </div>
                <div class="col-md-4">
                    <x-form.select
                        name="priority"
                        label="Priority"
                        :options="collect($priorities)->mapWithKeys(fn ($value) => [$value => ucfirst($value)])->all()"
                        :selected="$priority !== 'all' ? $priority : null"
                        placeholder="All priorities"
                    />
                </div>
                <div class="col-md-4">
                    <button class="btn btn-outline-primary" type="submit">Filter</button>
                </div>
            </form>
        </div>
    </div>

    <div class="card shadow-sm ihms-table-card">
        <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Room</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Reported by</th>
                        <th>Resolver</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($issues as $issue)
                        @php
                            $priorityClass = match ($issue->priority) {
                                'high' => 'bg-danger',
                                'medium' => 'bg-warning text-dark',
                                default => 'bg-secondary',
                            };
                            $statusClass = match ($issue->status) {
                                'resolved' => 'bg-success',
                                'in_progress' => 'bg-info text-dark',
                                default => 'bg-secondary',
                            };
                        @endphp
                        <tr>
                            <td class="fw-semibold">{{ $issue->room?->room_number ?? 'N/A' }}</td>
                            <td>
                                <div class="fw-semibold">{{ $issue->title }}</div>
                                <div class="text-muted small">{{ $issue->description }}</div>
                                <div class="text-muted small">Reported {{ $issue->created_at?->format('M d, Y') }}</div>
                            </td>
                            <td>
                                <span class="badge {{ $priorityClass }}">{{ ucfirst($issue->priority) }}</span>
                            </td>
                            <td>
                                <span class="badge {{ $statusClass }}">{{ ucfirst(str_replace('_', ' ', $issue->status)) }}</span>
                            </td>
                            <td>
                                {{ $issue->reportedBy?->name ?? 'N/A' }}
                                <div class="text-muted small">{{ $issue->reportedBy?->email ?? '' }}</div>
                            </td>
                            <td>
                                {{ $issue->resolvedBy?->name ?? 'Unassigned' }}
                                @if ($issue->resolved_at)
                                    <div class="text-muted small">Resolved {{ $issue->resolved_at->format('M d, Y') }}</div>
                                @endif
                            </td>
                            <td class="text-end">
                                @can('maintenance.manage')
                                    <form method="POST" action="{{ route('maintenance.issues.update', $issue) }}" class="d-inline-block text-start">
                                        @csrf
                                        @method('PATCH')
                                        <div class="mb-2">
                                            <label class="form-label small" for="status-{{ $issue->id }}">Status</label>
                                            <select id="status-{{ $issue->id }}" name="status" class="form-select form-select-sm">
                                                @foreach ($statuses as $value)
                                                    <option value="{{ $value }}" @selected($issue->status === $value)>
                                                        {{ ucfirst(str_replace('_', ' ', $value)) }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="mb-2">
                                            <label class="form-label small" for="priority-{{ $issue->id }}">Priority</label>
                                            <select id="priority-{{ $issue->id }}" name="priority" class="form-select form-select-sm">
                                                @foreach ($priorities as $value)
                                                    <option value="{{ $value }}" @selected($issue->priority === $value)>
                                                        {{ ucfirst($value) }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="mb-2">
                                            <label class="form-label small" for="resolver-{{ $issue->id }}">Resolver</label>
                                            <select id="resolver-{{ $issue->id }}" name="resolved_by_user_id" class="form-select form-select-sm">
                                                <option value="">Unassigned</option>
                                                @foreach ($resolvers as $resolver)
                                                    <option value="{{ $resolver->id }}" @selected($issue->resolved_by_user_id === $resolver->id)>
                                                        {{ $resolver->name }} ({{ $resolver->email }})
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="form-check mb-2">
                                            <input class="form-check-input" type="checkbox" value="1" id="out-of-service-{{ $issue->id }}" name="set_out_of_service">
                                            <label class="form-check-label small" for="out-of-service-{{ $issue->id }}">
                                                Mark room out of service (high priority only)
                                            </label>
                                        </div>
                                        <button class="btn btn-sm btn-primary" type="submit">Update</button>
                                    </form>
                                @else
                                    <span class="text-muted small">No actions</span>
                                @endcan
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center text-muted py-4">No maintenance issues found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($issues->hasPages())
            <div class="card-footer">
                {{ $issues->links() }}
            </div>
        @endif
    </div>
@endsection
