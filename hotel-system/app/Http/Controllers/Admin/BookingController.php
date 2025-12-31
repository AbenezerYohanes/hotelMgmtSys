<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class BookingController extends Controller
{
    public function index(Request $request): View
    {
        $filters = $request->validate([
            'booking_code' => ['nullable', 'string', 'max:30'],
            'guest' => ['nullable', 'string', 'max:255'],
            'room_number' => ['nullable', 'string', 'max:20'],
            'room_type_id' => ['nullable', 'exists:room_types,id'],
            'status' => ['nullable', Rule::in(Booking::STATUSES)],
            'check_in_from' => ['nullable', 'date'],
            'check_in_to' => ['nullable', 'date', 'after_or_equal:check_in_from'],
        ], [], [
            'booking_code' => 'booking code',
            'room_type_id' => 'room type',
            'room_number' => 'room number',
            'check_in_from' => 'check-in from',
            'check_in_to' => 'check-in to',
        ]);

        $status = $filters['status'] ?? null;
        $roomTypeId = $filters['room_type_id'] ?? null;
        $checkInFrom = $filters['check_in_from'] ?? null;
        $checkInTo = $filters['check_in_to'] ?? null;
        $guest = $filters['guest'] ?? null;
        $bookingCode = $filters['booking_code'] ?? null;
        $roomNumber = $filters['room_number'] ?? null;

        $query = Booking::with(['guest', 'room.roomType', 'invoice'])
            ->orderByDesc('created_at');

        if ($bookingCode) {
            $query->where('booking_code', 'like', '%'.$bookingCode.'%');
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($checkInFrom) {
            $query->whereDate('check_in_date', '>=', $checkInFrom);
        }

        if ($checkInTo) {
            $query->whereDate('check_in_date', '<=', $checkInTo);
        }

        if ($guest) {
            $like = '%'.$guest.'%';
            $query->whereHas('guest', function ($query) use ($like) {
                $query->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like);
            });
        }

        if ($roomTypeId) {
            $query->whereHas('room', fn ($query) => $query->where('room_type_id', $roomTypeId));
        }

        if ($roomNumber) {
            $query->whereHas('room', fn ($query) => $query->where('room_number', 'like', '%'.$roomNumber.'%'));
        }

        $bookings = $query->paginate(15)->withQueryString();

        $roomTypes = RoomType::orderBy('name')->get(['id', 'name']);
        $statusOptions = collect(Booking::STATUSES)
            ->mapWithKeys(fn ($status) => [$status => ucfirst(str_replace('_', ' ', $status))])
            ->all();

        return view('admin.bookings.index', [
            'bookings' => $bookings,
            'roomTypes' => $roomTypes,
            'statusOptions' => $statusOptions,
            'status' => $status,
            'roomTypeId' => $roomTypeId,
            'checkInFrom' => $checkInFrom,
            'checkInTo' => $checkInTo,
            'guest' => $guest,
            'bookingCode' => $bookingCode,
            'roomNumber' => $roomNumber,
        ]);
    }

    public function show(Booking $booking): View
    {
        $booking->load(['guest', 'room.roomType', 'invoice']);

        return view('admin.bookings.show', [
            'booking' => $booking,
        ]);
    }
}
