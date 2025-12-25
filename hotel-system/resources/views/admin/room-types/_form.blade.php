@php
    $activeValue = old('is_active', $roomType->is_active ?? true);
@endphp

<form method="POST" action="{{ $action }}">
    @csrf
    @if ($method !== 'POST')
        @method($method)
    @endif

    <x-form.input
        name="name"
        label="Name"
        :value="$roomType->name"
        required
    />

    <x-form.textarea
        name="description"
        label="Description"
        :value="$roomType->description"
        rows="3"
    />

    <div class="row">
        <div class="col-md-6">
            <x-form.input
                name="price_per_night"
                label="Price per night"
                type="number"
                step="0.01"
                min="0"
                :value="$roomType->price_per_night"
                required
            />
        </div>
        <div class="col-md-6">
            <x-form.input
                name="max_occupancy"
                label="Max occupancy"
                type="number"
                min="1"
                :value="$roomType->max_occupancy"
                required
            />
        </div>
    </div>

    <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="is_active" name="is_active" value="1" {{ $activeValue ? 'checked' : '' }}>
        <label class="form-check-label" for="is_active">Active</label>
    </div>

    <div class="d-flex gap-2">
        <button class="btn btn-primary" type="submit">{{ $submitLabel }}</button>
        <a class="btn btn-outline-secondary" href="{{ route('admin.room-types.index') }}">Cancel</a>
    </div>
</form>
