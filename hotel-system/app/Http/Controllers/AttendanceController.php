<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function clockIn(Request $request): RedirectResponse
    {
        $employee = $request->user()->employee;
        if (! $employee) {
            abort(403);
        }

        if (! $employee->is_active) {
            return back()->with('error', 'Inactive employees cannot clock in.');
        }

        $today = now()->toDateString();
        $time = now()->format('H:i:s');

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();

        if ($attendance && $attendance->clock_in_time) {
            return back()->with('error', 'You have already clocked in today.');
        }

        if (! $attendance) {
            $attendance = Attendance::create([
                'employee_id' => $employee->id,
                'date' => $today,
                'clock_in_time' => $time,
                'status' => 'present',
            ]);
        } else {
            $attendance->update([
                'clock_in_time' => $time,
                'status' => 'present',
            ]);
        }

        $this->logAudit($request->user()->id, $attendance->id, 'attendance.clock_in', [
            'employee_id' => $employee->id,
            'date' => $today,
            'clock_in_time' => $time,
        ]);

        return back()->with('success', "Clocked in at {$time}.");
    }

    public function clockOut(Request $request): RedirectResponse
    {
        $employee = $request->user()->employee;
        if (! $employee) {
            abort(403);
        }

        if (! $employee->is_active) {
            return back()->with('error', 'Inactive employees cannot clock out.');
        }

        $today = now()->toDateString();
        $time = now()->format('H:i:s');

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();

        if (! $attendance || ! $attendance->clock_in_time) {
            return back()->with('error', 'Please clock in before clocking out.');
        }

        if ($attendance->clock_out_time) {
            return back()->with('error', 'You have already clocked out today.');
        }

        $attendance->update([
            'clock_out_time' => $time,
        ]);

        $this->logAudit($request->user()->id, $attendance->id, 'attendance.clock_out', [
            'employee_id' => $employee->id,
            'date' => $today,
            'clock_out_time' => $time,
        ]);

        return back()->with('success', "Clocked out at {$time}.");
    }

    private function logAudit(int $userId, int $attendanceId, string $action, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => 'attendance',
            'entity_id' => $attendanceId,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}
