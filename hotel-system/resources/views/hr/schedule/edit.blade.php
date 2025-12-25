@extends('layouts.app')

@section('title', 'Edit Shift Assignment')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Edit shift assignment</h1>
            <p class="text-muted mb-0">Update the assigned employee, shift, or date.</p>
        </div>
        <a class="btn btn-outline-secondary" href="{{ route('hr.schedule.index') }}">Back to schedule</a>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">
            <form method="POST" action="{{ route('hr.schedule.update', $assignment) }}" class="row g-3">
                @csrf
                @method('PUT')
                <div class="col-md-4">
                    <x-form.select
                        name="employee_id"
                        label="Employee"
                        :options="$employees->mapWithKeys(fn ($employee) => [$employee->id => $employee->full_name])->all()"
                        :selected="$assignment->employee_id"
                        required
                    />
                </div>
                <div class="col-md-4">
                    <x-form.select
                        name="shift_id"
                        label="Shift"
                        :options="$shifts->mapWithKeys(fn ($shift) => [$shift->id => $shift->name.' ('.$shift->start_time.' - '.$shift->end_time.')'])->all()"
                        :selected="$assignment->shift_id"
                        required
                    />
                </div>
                <div class="col-md-4">
                    <x-form.input
                        name="work_date"
                        type="date"
                        label="Work date"
                        :value="$assignment->work_date?->toDateString()"
                        required
                    />
                </div>
                <div class="col-12">
                    <button class="btn btn-primary" type="submit">Save changes</button>
                    <a class="btn btn-outline-secondary" href="{{ route('hr.schedule.index') }}">Cancel</a>
                </div>
            </form>
        </div>
    </div>
@endsection
