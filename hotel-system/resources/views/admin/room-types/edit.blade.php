@extends('layouts.app')

@section('title', 'Edit Room Type')

@section('content')
    <div class="card shadow-sm">
        <div class="card-body">
            <h1 class="h4 mb-3">Edit room type</h1>
            @include('admin.room-types._form', [
                'action' => route('admin.room-types.update', $roomType),
                'method' => 'PUT',
                'submitLabel' => 'Update room type',
            ])
        </div>
    </div>
@endsection
