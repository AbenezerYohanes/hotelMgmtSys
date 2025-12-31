<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class ShiftScheduleController extends Controller
{
    public function index(Request $request): View
    {
        $this->authorizeView($request);

        $filters = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'employee_id' => ['nullable', 'exists:employees,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'active' => ['nullable', 'in:all,active,inactive'],
        ], [], [
            'start_date' => 'start date',
            'end_date' => 'end date',
            'employee_id' => 'employee',
            'shift_id' => 'shift',
        ]);

        $startDate = $filters['start_date'] ?? now()->toDateString();
        $endDate = $filters['end_date'] ?? now()->addDays(7)->toDateString();
        $employeeId = $filters['employee_id'] ?? null;
        $shiftId = $filters['shift_id'] ?? null;
        $active = $filters['active'] ?? 'all';

        $assignments = ShiftAssignment::with(['employee.user.roles', 'shift'])
            ->whereBetween('work_date', [$startDate, $endDate])
            ->when($employeeId, fn ($query, $value) => $query->where('employee_id', $value))
            ->when($shiftId, fn ($query, $value) => $query->where('shift_id', $value))
            ->when($active !== 'all', function ($query) use ($active) {
                $query->whereHas('employee', function ($employeeQuery) use ($active) {
                    $employeeQuery->where('is_active', $active === 'active');
                });
            })
            ->orderBy('work_date')
            ->paginate(20)
            ->withQueryString();

        $employees = Employee::with('user.roles')
            ->whereHas('user', function ($userQuery) {
                $userQuery->where('is_deleted', false);
            })
            ->orderBy('full_name')
            ->get();

        $assignableEmployees = $employees->filter(fn (Employee $employee) => $employee->is_active)->values();

        $shifts = Shift::orderBy('start_time')->get();

        return view('hr.schedule.index', [
            'assignments' => $assignments,
            'employees' => $employees,
            'assignableEmployees' => $assignableEmployees,
            'shifts' => $shifts,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'employeeId' => $employeeId,
            'shiftId' => $shiftId,
            'active' => $active,
            'canManage' => $request->user()->can('hr.manage'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeManage($request);

        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'shift_id' => ['required', 'exists:shifts,id'],
            'work_date' => ['required', 'date'],
        ], [], [
            'employee_id' => 'employee',
            'shift_id' => 'shift',
            'work_date' => 'work date',
        ]);

        $employee = Employee::findOrFail($data['employee_id']);
        $employee->load('user');
        if (! $employee->is_active) {
            return back()->with('error', 'Inactive employees cannot be assigned to shifts.');
        }
        if ($employee->user && $employee->user->is_deleted) {
            return back()->with('error', 'Deleted employees cannot be assigned to shifts.');
        }

        $this->ensureUniqueAssignment($data['employee_id'], $data['work_date']);

        $assignment = ShiftAssignment::create([
            'employee_id' => $data['employee_id'],
            'shift_id' => $data['shift_id'],
            'work_date' => $data['work_date'],
        ]);

        $this->logAudit($request->user()->id, 'shift_assignment.created', [
            'assignment_id' => $assignment->id,
            'employee_id' => $data['employee_id'],
            'shift_id' => $data['shift_id'],
            'work_date' => $data['work_date'],
        ]);

        return redirect()
            ->route('hr.schedule.index', [
                'start_date' => $data['work_date'],
                'end_date' => $data['work_date'],
            ])
            ->with('success', 'Shift assignment created.');
    }

    public function edit(Request $request, ShiftAssignment $assignment): View
    {
        $this->authorizeManage($request);

        $assignment->load(['employee.user.roles', 'shift']);

        $employees = Employee::with('user.roles')
            ->whereHas('user', function ($userQuery) {
                $userQuery->where('is_deleted', false);
            })
            ->orderBy('full_name')
            ->get();

        $shifts = Shift::orderBy('start_time')->get();

        return view('hr.schedule.edit', [
            'assignment' => $assignment,
            'employees' => $employees,
            'shifts' => $shifts,
            'canManage' => $request->user()->can('hr.manage'),
        ]);
    }

    public function update(Request $request, ShiftAssignment $assignment): RedirectResponse
    {
        $this->authorizeManage($request);

        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'shift_id' => ['required', 'exists:shifts,id'],
            'work_date' => ['required', 'date'],
        ], [], [
            'employee_id' => 'employee',
            'shift_id' => 'shift',
            'work_date' => 'work date',
        ]);

        $employee = Employee::findOrFail($data['employee_id']);
        $employee->load('user');
        if (! $employee->is_active) {
            return back()->with('error', 'Inactive employees cannot be assigned to shifts.');
        }
        if ($employee->user && $employee->user->is_deleted) {
            return back()->with('error', 'Deleted employees cannot be assigned to shifts.');
        }

        $this->ensureUniqueAssignment($data['employee_id'], $data['work_date'], $assignment->id);

        $assignment->update([
            'employee_id' => $data['employee_id'],
            'shift_id' => $data['shift_id'],
            'work_date' => $data['work_date'],
        ]);

        $this->logAudit($request->user()->id, 'shift_assignment.updated', [
            'assignment_id' => $assignment->id,
            'employee_id' => $assignment->employee_id,
            'shift_id' => $assignment->shift_id,
            'work_date' => $assignment->work_date?->toDateString(),
        ]);

        return redirect()
            ->route('hr.schedule.index')
            ->with('success', 'Shift assignment updated.');
    }

    public function destroy(Request $request, ShiftAssignment $assignment): RedirectResponse
    {
        $this->authorizeManage($request);

        $this->logAudit($request->user()->id, 'shift_assignment.deleted', [
            'assignment_id' => $assignment->id,
            'employee_id' => $assignment->employee_id,
            'shift_id' => $assignment->shift_id,
            'work_date' => $assignment->work_date?->toDateString(),
        ]);

        $assignment->delete();

        return back()->with('success', 'Shift assignment removed.');
    }

    private function ensureUniqueAssignment(int $employeeId, string $workDate, ?int $ignoreId = null): void
    {
        $query = ShiftAssignment::where('employee_id', $employeeId)
            ->whereDate('work_date', $workDate);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'employee_id' => 'This employee already has a shift assigned for the selected date.',
            ]);
        }
    }

    private function authorizeView(Request $request): void
    {
        if (! $request->user()->can('hr.view')) {
            abort(403);
        }
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()->can('hr.manage')) {
            abort(403);
        }
    }

    private function logAudit(int $userId, string $action, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => 'shift_assignment',
            'entity_id' => $meta['assignment_id'] ?? null,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}
