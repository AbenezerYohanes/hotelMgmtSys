<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\MaintenanceIssue;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class IssueController extends Controller
{
    private const PRIORITIES = ['low', 'medium', 'high'];
    private const STATUSES = ['open', 'in_progress', 'resolved'];

    public function create(Request $request): View
    {
        $this->authorizeReport($request);

        $rooms = Room::with('roomType')
            ->orderBy('room_number')
            ->get();

        return view('maintenance.issues.create', [
            'rooms' => $rooms,
            'priorities' => self::PRIORITIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeReport($request);

        $data = $request->validate([
            'room_id' => ['required', 'exists:rooms,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'priority' => ['required', 'in:'.implode(',', self::PRIORITIES)],
        ], [], [
            'room_id' => 'room',
        ]);

        $issue = MaintenanceIssue::create([
            'room_id' => $data['room_id'],
            'reported_by_user_id' => $request->user()->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'priority' => $data['priority'],
            'status' => 'open',
        ]);

        $this->logIssueEvent(
            $request->user()->id,
            $issue->id,
            'maintenance.issue_created',
            [
                'room_id' => $issue->room_id,
                'title' => $issue->title,
                'priority' => $issue->priority,
                'status' => $issue->status,
            ]
        );

        return redirect()
            ->route('maintenance.issues.create')
            ->with('success', 'Maintenance issue submitted.');
    }

    public function index(Request $request): View
    {
        $this->authorizeView($request);

        $filters = $request->validate([
            'status' => ['nullable', 'in:all,'.implode(',', self::STATUSES)],
            'priority' => ['nullable', 'in:all,'.implode(',', self::PRIORITIES)],
        ]);

        $status = $filters['status'] ?? 'all';
        $priority = $filters['priority'] ?? 'all';

        $query = MaintenanceIssue::with(['room.roomType', 'reportedBy', 'resolvedBy'])
            ->orderByDesc('created_at');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($priority && $priority !== 'all') {
            $query->where('priority', $priority);
        }

        $issues = $query->paginate(12)->withQueryString();

        $resolvers = User::role(['FrontDesk', 'Admin'])
            ->where('is_deleted', false)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $openIssuesCount = MaintenanceIssue::whereIn('status', ['open', 'in_progress'])->count();

        return view('maintenance.issues.index', [
            'issues' => $issues,
            'priorities' => self::PRIORITIES,
            'statuses' => self::STATUSES,
            'status' => $status,
            'priority' => $priority,
            'resolvers' => $resolvers,
            'openIssuesCount' => $openIssuesCount,
        ]);
    }

    public function update(Request $request, MaintenanceIssue $issue): RedirectResponse
    {
        $this->authorizeManage($request);

        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', self::STATUSES)],
            'priority' => ['required', 'in:'.implode(',', self::PRIORITIES)],
            'resolved_by_user_id' => ['nullable', 'exists:users,id'],
            'set_out_of_service' => ['nullable', 'boolean'],
        ], [], [
            'resolved_by_user_id' => 'resolver',
            'set_out_of_service' => 'out-of-service',
        ]);

        $resolverId = $data['resolved_by_user_id'] ?? null;
        if ($resolverId) {
            $resolver = User::role(['FrontDesk', 'Admin'])
                ->where('is_deleted', false)
                ->find($resolverId);
            if (! $resolver) {
                throw ValidationException::withMessages([
                    'resolved_by_user_id' => 'Selected resolver is invalid.',
                ]);
            }
        }

        $original = $issue->getAttributes();
        $statusWas = $issue->status;
        $resolvedAtWas = $issue->resolved_at;

        $update = [
            'status' => $data['status'],
            'priority' => $data['priority'],
            'resolved_by_user_id' => $resolverId,
        ];

        if ($data['status'] === 'resolved') {
            $update['resolved_at'] = $statusWas === 'resolved' && $resolvedAtWas
                ? $resolvedAtWas
                : now();
            if (! $resolverId) {
                $update['resolved_by_user_id'] = $request->user()->id;
            }
        } else {
            $update['resolved_at'] = null;
        }

        $issue->update($update);

        $roomOutOfService = false;
        $roomStatusWas = null;
        if ($request->boolean('set_out_of_service') && $data['priority'] === 'high') {
            $issue->load('room');
            if ($issue->room && $issue->room->status !== 'out_of_service') {
                $roomStatusWas = $issue->room->status;
                $issue->room->update(['status' => 'out_of_service']);
                $roomOutOfService = true;
            }
        }

        $changes = $this->buildChanges($issue, $original);
        if ($roomOutOfService) {
            $changes['room_status'] = [
                'from' => $roomStatusWas,
                'to' => 'out_of_service',
            ];
        }

        $action = ($statusWas !== 'resolved' && $issue->status === 'resolved')
            ? 'maintenance.issue_resolved'
            : 'maintenance.issue_updated';

        $this->logIssueEvent(
            $request->user()->id,
            $issue->id,
            $action,
            $changes
        );

        return back()->with('success', 'Maintenance issue updated.');
    }

    private function authorizeReport(Request $request): void
    {
        if (! $request->user()->can('maintenance.report')) {
            abort(403);
        }
    }

    private function authorizeView(Request $request): void
    {
        if (! $request->user()->can('maintenance.view')) {
            abort(403);
        }
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()->can('maintenance.manage')) {
            abort(403);
        }
    }

    private function buildChanges(MaintenanceIssue $issue, array $original): array
    {
        $fields = ['status', 'priority', 'resolved_by_user_id', 'resolved_at'];
        $changes = [];

        foreach ($fields as $field) {
            if ($issue->wasChanged($field)) {
                $changes[$field] = [
                    'from' => $original[$field] ?? null,
                    'to' => $issue->$field,
                ];
            }
        }

        return $changes;
    }

    private function logIssueEvent(int $userId, int $issueId, string $action, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => 'maintenance_issue',
            'entity_id' => $issueId,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}
