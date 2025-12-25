@props([
    'type' => 'info',
    'message' => null,
    'dismissible' => false,
])

@php
    $classes = 'alert alert-'.$type.($dismissible ? ' alert-dismissible fade show' : '');
@endphp

<div {{ $attributes->merge(['class' => $classes, 'role' => 'alert']) }}>
    {{ $message ?? $slot }}
    @if ($dismissible)
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    @endif
</div>
