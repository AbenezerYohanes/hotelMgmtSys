<?php

namespace App\Http\Controllers\Housekeeping;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\HousekeepingAssignment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class AssignmentController extends Controller
{
    public function index(Request $request): View
    {
        $this->authorizeAssign($request);

        $validated = $request->validate([
            'assigned_date' => ['nullable', 'date'],
        ], [], [
            'assigned_date' => 'assigned date',
        ]);

        $assignedDate = $validated['assigned_date'] ?? now()->toDateString();

        $assignments = HousekeepingAssignment::with(['room.roomType', 'housekeeper'])
            ->whereDate('assigned_date', $assignedDate)
            ->orderBy('room_id')
            ->get();

        $rooms = Room::with('roomType')
            ->where('is_active', true)
            ->where('status', '!=', 'out_of_service')
            ->orderBy('room_number')
            ->get();

        $housekeepers = User::role('Housekeeper')
            ->where('is_deleted', false)
            ->whereHas('employee', function ($employeeQuery) {
                $employeeQuery->where('is_active', true);
            })
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return view('housekeeping.assignments.index', [
            'assignments' => $assignments,
            'rooms' => $rooms,
            'housekeepers' => $housekeepers,
            'assignedDate' => $assignedDate,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeAssign($request);

        $data = $request->validate([
            'room_id' => ['required', 'exists:rooms,id'],
            'housekeeper_user_id' => ['required', 'exists:users,id'],
            'assigned_date' => ['required', 'date'],
        ], [], [
            'room_id' => 'room',
            'housekeeper_user_id' => 'housekeeper',
            'assigned_date' => 'assigned date',
        ]);

        $room = Room::findOrFail($data['room_id']);
        if (! $room->is_active || $room->status === 'out_of_service') {
            return back()->with('error', 'This room is not available for assignment.');
        }

        $housekeeper = User::role('Housekeeper')
            ->where('is_deleted', false)
            ->whereHas('employee', function ($employeeQuery) {
                $employeeQuery->where('is_active', true);
            })
            ->find($data['housekeeper_user_id']);
        if (! $housekeeper) {
            throw ValidationException::withMessages([
                'housekeeper_user_id' => 'Selected user is not a housekeeper.',
            ]);
        }

        $exists = HousekeepingAssignment::where('room_id', $room->id)
            ->whereDate('assigned_date', $data['assigned_date'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'This room is already assigned for the selected date.')->withInput();
        }

        $assignment = HousekeepingAssignment::create([
            'room_id' => $room->id,
            'housekeeper_user_id' => $housekeeper->id,
            'assigned_date' => $data['assigned_date'],
            'status' => 'assigned',
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'housekeeping.assignment_created',
            'entity_type' => 'housekeeping_assignment',
            'entity_id' => $assignment->id,
            'meta' => [
                'room_id' => $room->id,
                'housekeeper_user_id' => $housekeeper->id,
                'assigned_date' => $data['assigned_date'],
            ],
            'created_at' => now(),
        ]);

        return redirect()
            ->route('housekeeping.assignments.index', ['assigned_date' => $data['assigned_date']])
            ->with('success', 'Housekeeping assignment created.');
    }

    private function authorizeAssign(Request $request): void
    {
        if (! $request->user()->can('housekeeping.assign')) {
            abort(403);
        }
    }
}
