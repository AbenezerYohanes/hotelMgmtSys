<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Booking;
use App\Models\MaintenanceIssue;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        $user = $request->user();

        $myBookings = Booking::with(['room.roomType'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $attendanceToday = null;
        if ($user->employee) {
            $attendanceToday = Attendance::where('employee_id', $user->employee->id)
                ->whereDate('date', now()->toDateString())
                ->first();
        }

        $openIssuesCount = MaintenanceIssue::whereIn('status', ['open', 'in_progress'])->count();

        return view('dashboard', [
            'myBookings' => $myBookings,
            'attendanceToday' => $attendanceToday,
            'openIssuesCount' => $openIssuesCount,
        ]);
    }
}
