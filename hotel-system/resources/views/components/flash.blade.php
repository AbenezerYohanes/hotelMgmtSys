@php
    $messages = [
        'success' => session('success'),
        'error' => session('error'),
        'warning' => session('warning'),
        'info' => session('info'),
        'status' => session('status'),
    ];

    $typeMap = [
        'success' => 'success',
        'error' => 'danger',
        'warning' => 'warning',
        'info' => 'info',
        'status' => 'success',
    ];
@endphp

@foreach ($messages as $key => $message)
    @if ($message)
        <x-alert :type="$typeMap[$key]" :message="$message" />
    @endif
@endforeach
