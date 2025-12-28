<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BookingController extends Controller
{
    private const BLOCKING_STATUSES = ['pending', 'confirmed', 'checked_in'];

    public function search(Request $request): View
    {
        $roomTypes = RoomType::where('is_active', true)->orderBy('name')->get();
        $availableRooms = collect();
        $criteria = null;

        if ($request->filled('check_in_date') || $request->filled('check_out_date')) {
            $criteria = $this->validateSearch($request);
            $criteria['children'] = (int) ($criteria['children'] ?? 0);

            $occupants = $criteria['adults'] + $criteria['children'];

            $availableRooms = Room::with('roomType')
                ->where('is_active', true)
                ->where('status', '!=', 'out_of_service')
                ->when($criteria['room_type_id'], fn ($query, $roomTypeId) => $query->where('room_type_id', $roomTypeId))
                ->whereHas('roomType', function ($query) use ($occupants) {
                    $query->where('is_active', true)
                        ->where('max_occupancy', '>=', $occupants);
                })
                ->whereDoesntHave('bookings', function ($query) use ($criteria) {
                    $query->whereIn('status', self::BLOCKING_STATUSES)
                        ->overlapping($criteria['check_in_date'], $criteria['check_out_date']);
                })
                ->orderBy('room_number')
                ->get();
        }

        return view('guest.bookings.search', [
            'roomTypes' => $roomTypes,
            'availableRooms' => $availableRooms,
            'criteria' => $criteria,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateBooking($request);
        $data['children'] = (int) ($data['children'] ?? 0);

        $room = Room::with('roomType')->findOrFail($data['room_id']);

        if (! $room->is_active || $room->status === 'out_of_service') {
            return back()->with('error', 'This room is not available for booking.');
        }

        if (! $room->roomType || ! $room->roomType->is_active) {
            return back()->with('error', 'This room type is not available.');
        }

        $occupants = $data['adults'] + $data['children'];
        if ($occupants > $room->roomType->max_occupancy) {
            return back()->with('error', 'Selected room cannot accommodate the number of guests.');
        }

        $overlapExists = Booking::where('room_id', $room->id)
            ->whereIn('status', self::BLOCKING_STATUSES)
            ->overlapping($data['check_in_date'], $data['check_out_date'])
            ->exists();

        if ($overlapExists) {
            return back()->with('error', 'This room is no longer available for the selected dates.');
        }

        $booking = Booking::create([
            'booking_code' => Booking::generateCode(),
            'user_id' => $request->user()->id,
            'room_id' => $room->id,
            'check_in_date' => $data['check_in_date'],
            'check_out_date' => $data['check_out_date'],
            'status' => 'pending',
            'adults' => $data['adults'],
            'children' => $data['children'],
            'notes' => $data['notes'] ?? null,
        ]);

        $this->logAudit($request->user()->id, 'booking.created', $booking->id, [
            'source' => 'guest',
            'booking_code' => $booking->booking_code,
            'status' => $booking->status,
            'room_id' => $booking->room_id,
            'check_in_date' => $booking->check_in_date?->toDateString(),
            'check_out_date' => $booking->check_out_date?->toDateString(),
        ]);

        return redirect()
            ->route('guest.bookings.index')
            ->with('success', "Booking {$booking->booking_code} created and pending confirmation.");
    }

    public function index(Request $request): View
    {
        $bookings = Booking::with(['room.roomType'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return view('guest.bookings.index', [
            'bookings' => $bookings,
        ]);
    }

    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        if ($booking->user_id !== $request->user()->id && ! $request->user()->hasRole('Admin')) {
            abort(403);
        }

        if (! $booking->isCancellable()) {
            return back()->with('error', 'This booking cannot be cancelled.');
        }

        $booking->update(['status' => 'cancelled']);

        $this->logAudit($request->user()->id, 'booking.cancelled', $booking->id, [
            'source' => 'guest',
            'booking_code' => $booking->booking_code,
            'status' => $booking->status,
        ]);

        return back()->with('success', 'Booking cancelled successfully.');
    }

    private function validateSearch(Request $request): array
    {
        return $request->validate([
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'room_type_id' => ['nullable', 'exists:room_types,id'],
            'adults' => ['required', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
        ], [], [
            'check_in_date' => 'check-in date',
            'check_out_date' => 'check-out date',
        ]);
    }

    private function validateBooking(Request $request): array
    {
        return $request->validate([
            'room_id' => ['required', 'exists:rooms,id'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'adults' => ['required', 'integer', 'min:1'],
            'children' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ], [], [
            'check_in_date' => 'check-in date',
            'check_out_date' => 'check-out date',
        ]);
    }

    private function logAudit(int $userId, string $action, int $bookingId, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => 'booking',
            'entity_id' => $bookingId,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}

