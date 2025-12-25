<?php

namespace App\Http\Controllers\FrontDesk;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MaintenanceIssue;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    private const ACTIVE_STATUSES = ['pending', 'confirmed', 'checked_in'];

    public function index(Request $request): View
    {
        $today = now();
        $startDate = $today->toDateString();
        $endDate = $today->copy()->addDay()->toDateString();

        $rooms = Room::with(['roomType', 'bookings' => function ($query) use ($startDate, $endDate) {
            $query->whereIn('status', self::ACTIVE_STATUSES)
                ->overlapping($startDate, $endDate)
                ->with('guest')
                ->orderBy('check_in_date');
        }])
            ->orderBy('room_number')
            ->get()
            ->map(function (Room $room) {
                $booking = $room->bookings->firstWhere('status', 'checked_in')
                    ?? $room->bookings->firstWhere('status', 'confirmed')
                    ?? $room->bookings->firstWhere('status', 'pending');

                $bookingState = 'available';
                if ($booking) {
                    $bookingState = $booking->status === 'checked_in' ? 'occupied' : 'reserved';
                }

                $room->setAttribute('current_booking', $booking);
                $room->setAttribute('booking_state', $bookingState);

                return $room;
            });

        $openIssuesCount = MaintenanceIssue::whereIn('status', ['open', 'in_progress'])->count();

        return view('frontdesk.dashboard', [
            'rooms' => $rooms,
            'today' => $today,
            'openIssuesCount' => $openIssuesCount,
        ]);
    }

    public function calendar(): View
    {
        $bookings = Booking::with(['room', 'guest'])
            ->whereIn('status', ['pending', 'confirmed', 'checked_in', 'checked_out'])
            ->orderBy('check_in_date')
            ->get();

        $events = $bookings->map(function (Booking $booking) {
            $statusLabel = ucfirst(str_replace('_', ' ', $booking->status));
            $roomLabel = $booking->room?->room_number ?? 'Room';
            $guestLabel = $booking->guest?->name ?? 'Guest';

            return [
                'title' => "{$roomLabel} - {$guestLabel} ({$statusLabel})",
                'start' => $booking->check_in_date?->toDateString(),
                'end' => $booking->check_out_date?->toDateString(),
                'url' => route('frontdesk.bookings.show', $booking),
            ];
        });

        return view('frontdesk.calendar', [
            'events' => $events,
        ]);
    }
}
