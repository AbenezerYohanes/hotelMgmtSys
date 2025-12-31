<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AuditLogController extends Controller
{
    public function index(Request $request): View
    {
        $filters = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'action' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ], [], [
            'user_id' => 'user',
            'start_date' => 'start date',
            'end_date' => 'end date',
        ]);

        $startDate = $filters['start_date'] ?? now()->subDays(7)->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $userId = $filters['user_id'] ?? null;
        $action = $filters['action'] ?? null;

        $query = AuditLog::with('user')
            ->whereBetween('created_at', [
                "{$startDate} 00:00:00",
                "{$endDate} 23:59:59",
            ])
            ->when($userId, fn ($q, $value) => $q->where('user_id', $value))
            ->when($action, fn ($q, $value) => $q->where('action', $value))
            ->orderByDesc('created_at');

        $logs = $query->paginate(25)->withQueryString();

        $users = User::where('is_deleted', false)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);
        $actions = AuditLog::select('action')->distinct()->orderBy('action')->pluck('action');

        return view('admin.audit-logs.index', [
            'logs' => $logs,
            'users' => $users,
            'actions' => $actions,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'userId' => $userId,
            'actionFilter' => $action,
        ]);
    }
}
