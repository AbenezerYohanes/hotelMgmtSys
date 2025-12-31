@props([
    'name',
    'label' => null,
    'type' => 'text',
    'value' => null,
    'required' => false,
    'autocomplete' => null,
    'placeholder' => null,
])

@php
    $fieldId = $attributes->get('id', $name);
    $inputValue = $type === 'password' ? null : old($name, $value);
@endphp

<div class="mb-3">
    @if ($label)
        <label class="form-label" for="{{ $fieldId }}">{{ $label }}</label>
    @endif
    <input
        id="{{ $fieldId }}"
        name="{{ $name }}"
        type="{{ $type }}"
        @if ($inputValue !== null) value="{{ $inputValue }}" @endif
        @if ($placeholder) placeholder="{{ $placeholder }}" @endif
        @if ($required) required @endif
        @if ($autocomplete) autocomplete="{{ $autocomplete }}" @endif
        {{ $attributes->merge(['class' => 'form-control'.($errors->has($name) ? ' is-invalid' : '')])->except('id') }}
    >
    @error($name)
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>
