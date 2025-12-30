<?php

namespace App\Http\Controllers\FrontDesk;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Spatie\Permission\Models\Role;

class BookingController extends Controller
{
    private const BLOCKING_STATUSES = ['pending', 'confirmed', 'checked_in'];

    public function create(Request $request): View
    {
        $this->authorizeManage($request);

        $rooms = Room::with('roomType')
            ->where('is_active', true)
            ->where('status', '!=', 'out_of_service')
            ->orderBy('room_number')
            ->get();

        $guests = User::role('Guest')
            ->where('is_deleted', false)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return view('frontdesk.bookings.create', [
            'rooms' => $rooms,
            'guests' => $guests,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeManage($request);

        $data = $this->validateBooking($request);
        $data['children'] = (int) ($data['children'] ?? 0);

        $guest = $this->resolveGuest($request, $data);

        $room = Room::with('roomType')->findOrFail($data['room_id']);
        if (! $room->is_active || $room->status === 'out_of_service') {
            return back()->with('error', 'This room is not available for booking.');
        }

        $occupants = $data['adults'] + $data['children'];
        if (! $room->roomType || ! $room->roomType->is_active || $occupants > $room->roomType->max_occupancy) {
            return back()->with('error', 'Selected room cannot accommodate the number of guests.');
        }

        $overlapExists = Booking::where('room_id', $room->id)
            ->whereIn('status', self::BLOCKING_STATUSES)
            ->overlapping($data['check_in_date'], $data['check_out_date'])
            ->exists();

        if ($overlapExists) {
            return back()->with('error', 'This room is already booked for the selected dates.');
        }

        $booking = Booking::create([
            'booking_code' => Booking::generateCode(),
            'user_id' => $guest->id,
            'room_id' => $room->id,
            'check_in_date' => $data['check_in_date'],
            'check_out_date' => $data['check_out_date'],
            'status' => 'confirmed',
            'adults' => $data['adults'],
            'children' => $data['children'],
            'notes' => $data['notes'],
        ]);

        $this->logAudit($request->user()->id, 'booking.created', $booking->id, [
            'source' => 'frontdesk',
            'booking_code' => $booking->booking_code,
            'status' => $booking->status,
            'room_id' => $booking->room_id,
            'check_in_date' => $booking->check_in_date?->toDateString(),
            'check_out_date' => $booking->check_out_date?->toDateString(),
        ]);

        return redirect()
            ->route('frontdesk.bookings.show', $booking)
            ->with('success', "Booking {$booking->booking_code} created and confirmed.");
    }

    public function show(Booking $booking): View
    {
        $booking->load(['room.roomType', 'guest', 'invoice']);

        return view('frontdesk.bookings.show', [
            'booking' => $booking,
        ]);
    }

    public function confirm(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorizeManage($request);

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Only pending bookings can be confirmed.');
        }

        $booking->update(['status' => 'confirmed']);

        $this->logAudit($request->user()->id, 'booking.confirmed', $booking->id, [
            'status' => $booking->status,
        ]);

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorizeManage($request);

        if (! $booking->isCancellable()) {
            return back()->with('error', 'This booking cannot be cancelled.');
        }

        $booking->update(['status' => 'cancelled']);

        $this->logAudit($request->user()->id, 'booking.cancelled', $booking->id, [
            'status' => $booking->status,
        ]);

        return back()->with('success', 'Booking cancelled.');
    }

    public function checkIn(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorizeManage($request);

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Only confirmed bookings can be checked in.');
        }

        $today = now()->toDateString();
        $checkInDate = $booking->check_in_date?->toDateString();
        if ($checkInDate && $checkInDate > $today) {
            return back()->with('error', 'Cannot check in before the check-in date.');
        }

        $booking->load('room');
        $room = $booking->room;
        if (! $room || ! $room->is_active || $room->status === 'out_of_service') {
            return back()->with('error', 'Room is not available for check-in.');
        }

        $booking->update(['status' => 'checked_in']);

        $this->logAudit($request->user()->id, 'booking.checked_in', $booking->id, [
            'status' => $booking->status,
        ]);

        return back()->with('success', 'Guest checked in.');
    }

    public function checkOut(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorizeManage($request);

        if ($booking->status !== 'checked_in') {
            return back()->with('error', 'Only checked-in bookings can be checked out.');
        }

        $today = now()->toDateString();
        $checkInDate = $booking->check_in_date?->toDateString();
        if ($checkInDate && $checkInDate > $today) {
            return back()->with('error', 'Cannot check out before the check-in date.');
        }

        $booking->load(['room.roomType', 'invoice']);
        $room = $booking->room;
        if (! $room || ! $room->roomType) {
            return back()->with('error', 'Room information is missing for this booking.');
        }
        if (! $booking->check_in_date || ! $booking->check_out_date) {
            return back()->with('error', 'Booking dates are missing for this booking.');
        }

        $booking->update(['status' => 'checked_out']);
        $room->update(['status' => 'dirty']);

        $invoice = $booking->invoice ?? $this->createInvoice($booking, $request->user()->id);

        $this->logAudit($request->user()->id, 'booking.checked_out', $booking->id, [
            'status' => $booking->status,
            'invoice_id' => $invoice->id,
        ]);

        return redirect()
            ->route('frontdesk.invoices.show', $invoice)
            ->with('success', 'Guest checked out. Invoice generated.');
    }

    private function validateBooking(Request $request): array
    {
        return $request->validate([
            'guest_user_id' => ['nullable', 'exists:users,id'],
            'guest_name' => ['required_without:guest_user_id', 'string', 'max:255'],
            'guest_email' => [
                'required_without:guest_user_id',
                'email',
                'max:255',
                Rule::when(! $request->filled('guest_user_id'), Rule::unique('users', 'email')),
            ],
            'room_id' => ['required', 'exists:rooms,id'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'adults' => ['required', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ], [], [
            'guest_user_id' => 'existing guest',
            'guest_name' => 'guest name',
            'guest_email' => 'guest email',
            'check_in_date' => 'check-in date',
            'check_out_date' => 'check-out date',
        ]);
    }

    private function resolveGuest(Request $request, array $data): User
    {
        if (! empty($data['guest_user_id'])) {
            $guest = User::role('Guest')
                ->where('is_deleted', false)
                ->find($data['guest_user_id']);
            if (! $guest) {
                throw ValidationException::withMessages([
                    'guest_user_id' => 'Selected guest is invalid.',
                ]);
            }

            return $guest;
        }

        $guest = User::create([
            'name' => $data['guest_name'],
            'email' => $data['guest_email'],
            'password' => Hash::make(Str::random(16)),
            'role' => 'Guest',
        ]);

        $guestRole = Role::firstOrCreate(['name' => 'Guest']);
        $guest->assignRole($guestRole);

        return $guest;
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()->can('frontdesk.manage')) {
            abort(403);
        }
    }

    private function createInvoice(Booking $booking, int $userId): Invoice
    {
        $room = $booking->room;
        $roomType = $room?->roomType;

        if (! $room || ! $roomType || ! $booking->check_in_date || ! $booking->check_out_date) {
            throw new \RuntimeException('Unable to generate invoice without room details.');
        }

        $nights = max(1, $booking->check_in_date->diffInDays($booking->check_out_date));
        $unitPrice = (float) $roomType->price_per_night;
        $subtotal = round($nights * $unitPrice, 2);
        $taxRate = (float) config('ihms.tax_rate', 0);
        $tax = round($subtotal * $taxRate, 2);
        $total = round($subtotal + $tax, 2);

        $invoice = Invoice::create([
            'booking_id' => $booking->id,
            'invoice_number' => Invoice::generateNumber(),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'payment_status' => 'unpaid',
        ]);

        $description = sprintf(
            'Room %s - %s (%d night%s)',
            $room->room_number,
            $roomType->name,
            $nights,
            $nights === 1 ? '' : 's'
        );

        $invoice->items()->create([
            'description' => $description,
            'qty' => $nights,
            'unit_price' => $unitPrice,
            'line_total' => $subtotal,
        ]);

        $this->logAudit($userId, 'invoice.created', $invoice->id, [
            'booking_id' => $booking->id,
            'invoice_number' => $invoice->invoice_number,
            'total' => $invoice->total,
        ]);

        return $invoice;
    }

    private function logAudit(int $userId, string $action, int $entityId, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => $action === 'invoice.created' ? 'invoice' : 'booking',
            'entity_id' => $entityId,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}
