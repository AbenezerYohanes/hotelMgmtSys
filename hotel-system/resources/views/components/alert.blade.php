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
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    @endif
</div>
