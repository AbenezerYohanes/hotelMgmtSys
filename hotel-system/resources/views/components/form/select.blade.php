@props([
    'name',
    'label' => null,
    'options' => [],
    'selected' => null,
    'required' => false,
    'placeholder' => null,
])

@php
    $fieldId = $attributes->get('id', $name);
    $selectedValue = old($name, $selected);
@endphp

<div class="mb-3">
    @if ($label)
        <label class="form-label" for="{{ $fieldId }}">{{ $label }}</label>
    @endif
    <select
        id="{{ $fieldId }}"
        name="{{ $name }}"
        @if ($required) required @endif
        {{ $attributes->merge(['class' => 'form-select'.($errors->has($name) ? ' is-invalid' : '')])->except('id') }}
    >
        @if ($placeholder !== null)
            <option value="">{{ $placeholder }}</option>
        @endif
        @foreach ($options as $value => $optionLabel)
            <option value="{{ $value }}" @selected((string) $selectedValue === (string) $value)>
                {{ $optionLabel }}
            </option>
        @endforeach
    </select>
    @error($name)
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>
