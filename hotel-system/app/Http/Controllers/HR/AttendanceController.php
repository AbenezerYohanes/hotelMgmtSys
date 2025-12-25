<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;

class AttendanceController extends Controller
{
    public function index(Request $request): Response|View
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

        if ($request->query('export') === 'csv') {
            $fileName = "attendance_{$startDate}_to_{$endDate}.csv";
            $rows = $query->orderBy('date')->get();

            return response()->streamDownload(function () use ($rows) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['Date', 'Employee', 'Email', 'Role', 'Clock In', 'Clock Out', 'Status']);
                foreach ($rows as $attendance) {
                    $employee = $attendance->employee;
                    $user = $employee?->user;
                    $role = $user?->getRoleNames()->implode(', ') ?: ($user?->role ?? 'N/A');
                    fputcsv($handle, [
                        $attendance->date?->toDateString(),
                        $employee?->full_name ?? 'N/A',
                        $user?->email ?? 'N/A',
                        $role,
                        $attendance->clock_in_time ?? 'N/A',
                        $attendance->clock_out_time ?? 'N/A',
                        $attendance->status ?? 'N/A',
                    ]);
                }
                fclose($handle);
            }, $fileName, [
                'Content-Type' => 'text/csv',
            ]);
        }

        $attendances = $query->orderByDesc('date')->paginate(20)->withQueryString();

        $employees = Employee::orderBy('full_name')->get(['id', 'full_name']);

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
