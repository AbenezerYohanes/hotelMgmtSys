@extends('layouts.app')

@section('title', 'Edit Room')

@section('content')
    <div class="card shadow-sm">
        <div class="card-body">
            <h1 class="h4 mb-3">Edit room</h1>
            @include('admin.rooms._form', [
                'action' => route('admin.rooms.update', $room),
                'method' => 'PUT',
                'submitLabel' => 'Update room',
            ])
        </div>
    </div>
@endsection
