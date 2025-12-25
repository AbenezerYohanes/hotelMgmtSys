@extends('layouts.app')

@section('title', 'Report Maintenance Issue')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Report maintenance issue</h1>
            <p class="text-muted mb-0">Log room issues for quick resolution.</p>
        </div>
        @can('maintenance.view')
            <a class="btn btn-outline-secondary" href="{{ route('maintenance.issues.index') }}">View issues</a>
        @endcan
    </div>

    <div class="card shadow-sm">
        <div class="card-body">
            <form method="POST" action="{{ route('maintenance.issues.store') }}">
                @csrf
                <div class="row">
                    <div class="col-md-6">
                        <x-form.select
                            name="room_id"
                            label="Room"
                            :options="$rooms->mapWithKeys(fn ($room) => [$room->id => $room->room_number.' - '.$room->roomType?->name])->all()"
                            placeholder="Select a room"
                            required
                        />
                    </div>
                    <div class="col-md-6">
                        <x-form.select
                            name="priority"
                            label="Priority"
                            :options="collect($priorities)->mapWithKeys(fn ($value) => [$value => ucfirst($value)])->all()"
                            :selected="old('priority', 'medium')"
                            required
                        />
                    </div>
                </div>

                <x-form.input name="title" label="Title" required />
                <x-form.textarea name="description" label="Description" rows="4" required />

                <div class="d-flex gap-2">
                    <button class="btn btn-primary" type="submit">Submit issue</button>
                    <a class="btn btn-outline-secondary" href="{{ route('dashboard') }}">Back to dashboard</a>
                </div>
            </form>
        </div>
    </div>
@endsection
