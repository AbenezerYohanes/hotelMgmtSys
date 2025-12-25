@php
    $activeValue = old('is_active', $room->is_active ?? true);
@endphp

<form method="POST" action="{{ $action }}">
    @csrf
    @if ($method !== 'POST')
        @method($method)
    @endif

    <div class="row">
        <div class="col-md-6">
            <x-form.input
                name="room_number"
                label="Room number"
                :value="$room->room_number"
                required
            />
        </div>
        <div class="col-md-6">
            <x-form.select
                name="room_type_id"
                label="Room type"
                :options="$roomTypes->pluck('name', 'id')->all()"
                :selected="$room->room_type_id"
                placeholder="Select room type"
                required
            />
        </div>
    </div>

    <div class="row">
        <div class="col-md-4">
            <x-form.input
                name="floor"
                label="Floor"
                type="number"
                min="0"
                :value="$room->floor"
                required
            />
        </div>
        <div class="col-md-4">
            <x-form.select
                name="status"
                label="Status"
                :options="collect($statuses)->mapWithKeys(fn ($status) => [$status => ucfirst(str_replace('_', ' ', $status))])->all()"
                :selected="$room->status ?? 'clean'"
                required
            />
        </div>
        <div class="col-md-4 d-flex align-items-end">
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="is_active" name="is_active" value="1" {{ $activeValue ? 'checked' : '' }}>
                <label class="form-check-label" for="is_active">Active</label>
            </div>
        </div>
    </div>

    <div class="d-flex gap-2">
        <button class="btn btn-primary" type="submit">{{ $submitLabel }}</button>
        <a class="btn btn-outline-secondary" href="{{ route('admin.rooms.index') }}">Cancel</a>
    </div>
</form>
