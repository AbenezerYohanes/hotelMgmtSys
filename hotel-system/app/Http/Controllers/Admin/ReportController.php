<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ReportController extends Controller
{
    public function index(Request $request): View
    {
        $today = now()->startOfDay();
        $todayDate = $today->toDateString();

        $activeRoomsCount = Room::where('is_active', true)
            ->where('status', '!=', 'out_of_service')
            ->count();

        $occupiedRoomsCount = Booking::where('status', 'checked_in')
            ->where('check_in_date', '<=', $todayDate)
            ->where('check_out_date', '>', $todayDate)
            ->distinct('room_id')
            ->count('room_id');

        $occupancyRate = $activeRoomsCount > 0
            ? ($occupiedRoomsCount / $activeRoomsCount) * 100
            : 0;

        $revenueToday = (float) Invoice::whereDate('created_at', $todayDate)->sum('total');

        $arrivalsToday = Booking::whereDate('check_in_date', $todayDate)
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        $departuresToday = Booking::whereDate('check_out_date', $todayDate)
            ->whereIn('status', ['confirmed', 'checked_in', 'checked_out'])
            ->count();

        $monthStart = $today->copy()->startOfMonth();
        $monthEnd = $today->copy()->endOfMonth();

        $revenueMonth = (float) Invoice::whereBetween('created_at', [$monthStart, $monthEnd])->sum('total');

        $bookingsMonth = Booking::whereIn('status', ['checked_in', 'checked_out'])
            ->where('check_out_date', '>=', $monthStart->toDateString())
            ->where('check_in_date', '<=', $todayDate)
            ->get(['room_id', 'check_in_date', 'check_out_date']);

        $daysInRange = $monthStart->diffInDays($today) + 1;
        $totalOccupiedRooms = 0;

        $dateCursor = $monthStart->copy();
        while ($dateCursor->lte($today)) {
            $occupiedForDay = $bookingsMonth
                ->filter(function ($booking) use ($dateCursor) {
                    return $booking->check_in_date <= $dateCursor
                        && $booking->check_out_date > $dateCursor;
                })
                ->pluck('room_id')
                ->unique()
                ->count();

            $totalOccupiedRooms += $occupiedForDay;
            $dateCursor->addDay();
        }

        $averageOccupancy = ($activeRoomsCount > 0 && $daysInRange > 0)
            ? ($totalOccupiedRooms / ($activeRoomsCount * $daysInRange)) * 100
            : 0;

        return view('admin.reports.index', [
            'activeRoomsCount' => $activeRoomsCount,
            'occupiedRoomsCount' => $occupiedRoomsCount,
            'occupancyRate' => $occupancyRate,
            'revenueToday' => $revenueToday,
            'arrivalsToday' => $arrivalsToday,
            'departuresToday' => $departuresToday,
            'revenueMonth' => $revenueMonth,
            'averageOccupancy' => $averageOccupancy,
            'today' => $today,
            'monthStart' => $monthStart,
        ]);
    }
}
