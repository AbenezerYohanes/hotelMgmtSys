@extends('layouts.app')

@section('title', 'New Walk-in Booking')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">New walk-in booking</h1>
            <p class="text-muted mb-0">Create and confirm a reservation at the desk.</p>
        </div>
        <a class="btn btn-outline-secondary" href="{{ route('frontdesk.dashboard') }}">Back to matrix</a>
    </div>

    <div class="card shadow-sm">
        <div class="card-body">
            <form method="POST" action="{{ route('frontdesk.bookings.store') }}">
                @csrf

                <h2 class="h6">Guest</h2>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.select
                            name="guest_user_id"
                            label="Existing guest (optional)"
                            :options="$guests->mapWithKeys(fn ($guest) => [$guest->id => $guest->name.' ('.$guest->email.')'])->all()"
                            placeholder="Select a guest"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.input
                            name="guest_name"
                            label="Guest name"
                            autocomplete="name"
                        />
                    </div>
                    <div class="col-md-6">
                        <x-form.input
                            name="guest_email"
                            label="Guest email"
                            type="email"
                            autocomplete="email"
                        />
                    </div>
                </div>
                <p class="text-muted small">
                    Selecting an existing guest auto-fills the name and email.
                </p>

                <hr class="my-4">

                <h2 class="h6">Booking details</h2>
                <div class="row">
                    <div class="col-md-6">
                        <x-form.select
                            name="room_id"
                            label="Room"
                            :options="$rooms->mapWithKeys(fn ($room) => [$room->id => $room->room_number.' - '.$room->roomType?->name])->all()"
                            placeholder="Select a room"
                            required
                        />
                    </div>
                    <div class="col-md-3">
                        <x-form.input
                            name="check_in_date"
                            type="date"
                            label="Check-in"
                            required
                        />
                    </div>
                    <div class="col-md-3">
                        <x-form.input
                            name="check_out_date"
                            type="date"
                            label="Check-out"
                            required
                        />
                    </div>
                    <div class="col-md-3">
                        <x-form.input
                            name="adults"
                            type="number"
                            label="Adults"
                            min="1"
                            value="1"
                            required
                        />
                    </div>
                    <div class="col-md-3">
                        <x-form.input
                            name="children"
                            type="number"
                            label="Children"
                            min="0"
                            value="0"
                        />
                    </div>
                </div>
                <x-form.textarea name="notes" label="Notes" rows="3" />

                <div class="d-flex gap-2">
                    <button class="btn btn-primary" type="submit">Create booking</button>
                    <a class="btn btn-outline-secondary" href="{{ route('frontdesk.dashboard') }}">Cancel</a>
                </div>
            </form>
        </div>
    </div>
    @push('scripts')
        <script>
            (() => {
                const guests = @json($guests->mapWithKeys(fn ($guest) => [$guest->id => ['name' => $guest->name, 'email' => $guest->email]]));
                const select = document.getElementById('guest_user_id');
                const nameInput = document.getElementById('guest_name');
                const emailInput = document.getElementById('guest_email');

                if (!select || !nameInput || !emailInput) {
                    return;
                }

                const clearAutofill = () => {
                    if (nameInput.dataset.autofilled === 'true') {
                        nameInput.value = '';
                        delete nameInput.dataset.autofilled;
                    }
                    if (emailInput.dataset.autofilled === 'true') {
                        emailInput.value = '';
                        delete emailInput.dataset.autofilled;
                    }
                };

                const syncGuestDetails = () => {
                    const guest = guests[select.value];

                    if (guest) {
                        nameInput.value = guest.name || '';
                        emailInput.value = guest.email || '';
                        nameInput.dataset.autofilled = 'true';
                        emailInput.dataset.autofilled = 'true';
                        nameInput.readOnly = true;
                        emailInput.readOnly = true;
                        return;
                    }

                    clearAutofill();
                    nameInput.readOnly = false;
                    emailInput.readOnly = false;
                };

                select.addEventListener('change', syncGuestDetails);
                syncGuestDetails();
            })();
        </script>
    @endpush
@endsection
