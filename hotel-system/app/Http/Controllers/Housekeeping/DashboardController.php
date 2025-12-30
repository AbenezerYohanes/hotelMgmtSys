<?php

namespace App\Http\Controllers\Housekeeping;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\HousekeepingAssignment;
use App\Models\MaintenanceIssue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        $today = now();
        $user = $request->user();
        $isAdmin = $user->hasRole('Admin');

        $assignments = HousekeepingAssignment::with(['room.roomType', 'housekeeper'])
            ->when(! $isAdmin, function ($query) use ($user) {
                $query->where('housekeeper_user_id', $user->id);
            })
            ->whereDate('assigned_date', $today->toDateString())
            ->orderBy('assigned_date')
            ->orderBy('room_id')
            ->get();

        $openIssuesCount = MaintenanceIssue::whereIn('status', ['open', 'in_progress'])->count();

        return view('housekeeping.dashboard', [
            'assignments' => $assignments,
            'today' => $today,
            'openIssuesCount' => $openIssuesCount,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function updateStatus(Request $request, HousekeepingAssignment $assignment): RedirectResponse
    {
        $this->authorizeManage($request);

        $data = $request->validate([
            'room_status' => ['required', 'in:clean,dirty'],
        ], [], [
            'room_status' => 'room status',
        ]);

        $user = $request->user();

        if ($assignment->housekeeper_user_id !== $user->id && ! $user->hasRole('Admin')) {
            abort(403);
        }

        $today = now()->toDateString();
        if ($assignment->assigned_date?->toDateString() !== $today && ! $user->hasRole('Admin')) {
            return back()->with('error', 'You can only update rooms assigned for today.');
        }

        $assignment->load('room');
        $room = $assignment->room;

        if (! $room || ! $room->is_active) {
            return back()->with('error', 'This room is not available for housekeeping updates.');
        }

        if ($room->status === 'out_of_service') {
            return back()->with('error', 'Out-of-service rooms cannot be updated.');
        }

        $fromStatus = $room->status;
        $toStatus = $data['room_status'];

        if ($fromStatus === $toStatus) {
            return back()->with('success', 'Room status is already up to date.');
        }

        $room->update(['status' => $toStatus]);
        $assignment->update([
            'status' => $toStatus === 'clean' ? 'done' : 'assigned',
        ]);

        $this->logStatusChange($user->id, $room->id, $assignment->id, $fromStatus, $toStatus);

        $message = $toStatus === 'clean'
            ? 'Room marked clean. Assignment completed.'
            : 'Room marked dirty.';

        return back()->with('success', $message);
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()->can('housekeeping.manage')) {
            abort(403);
        }
    }

    private function logStatusChange(int $userId, int $roomId, int $assignmentId, string $from, string $to): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => 'room.status_changed',
            'entity_type' => 'room',
            'entity_id' => $roomId,
            'meta' => [
                'from' => $from,
                'to' => $to,
                'assignment_id' => $assignmentId,
            ],
            'created_at' => now(),
        ]);
    }
}
