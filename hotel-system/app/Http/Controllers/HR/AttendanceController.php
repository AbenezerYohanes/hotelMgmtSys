<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AttendanceController extends Controller
{
    public function index(Request $request): View
    {
        $this->authorizeView($request);

        $filters = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'employee_id' => ['nullable', 'exists:employees,id'],
        ], [], [
            'start_date' => 'start date',
            'end_date' => 'end date',
            'employee_id' => 'employee',
        ]);

        $startDate = $filters['start_date'] ?? now()->subDays(7)->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $employeeId = $filters['employee_id'] ?? null;

        $query = Attendance::with(['employee.user.roles'])
            ->whereBetween('date', [$startDate, $endDate])
            ->when($employeeId, fn ($q, $value) => $q->where('employee_id', $value));

        $attendances = $query->orderByDesc('date')->paginate(20)->withQueryString();

        $employees = Employee::whereHas('user', function ($userQuery) {
            $userQuery->where('is_deleted', false);
        })
            ->orderBy('full_name')
            ->get(['id', 'full_name']);

        return view('hr.attendance.index', [
            'attendances' => $attendances,
            'employees' => $employees,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'employeeId' => $employeeId,
        ]);
    }

    private function authorizeView(Request $request): void
    {
        if (! $request->user()->can('hr.view')) {
            abort(403);
        }
    }
}
