@extends('layouts.app')

@section('title', 'Create Room')

@section('content')
    <div class="card shadow-sm">
        <div class="card-body">
            <h1 class="h4 mb-3">Create room</h1>
            @include('admin.rooms._form', [
                'action' => route('admin.rooms.store'),
                'method' => 'POST',
                'submitLabel' => 'Create room',
            ])
        </div>
    </div>
@endsection
