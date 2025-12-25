@extends('layouts.app')

@section('title', 'Create Room Type')

@section('content')
    <div class="card shadow-sm">
        <div class="card-body">
            <h1 class="h4 mb-3">Create room type</h1>
            @include('admin.room-types._form', [
                'action' => route('admin.room-types.store'),
                'method' => 'POST',
                'submitLabel' => 'Create room type',
            ])
        </div>
    </div>
@endsection
