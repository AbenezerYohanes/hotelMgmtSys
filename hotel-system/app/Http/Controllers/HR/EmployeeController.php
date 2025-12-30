<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
{
    private const STAFF_ROLES = ['FrontDesk', 'Housekeeper', 'HRManager', 'Admin'];
    private const ADMIN_ROLE = 'Admin';
    private const DEFAULT_PASSWORD = 'Password@123';

    public function index(Request $request): View
    {
        $this->authorizeView($request);

        $filters = $request->validate([
            'active' => ['nullable', 'in:all,active,inactive'],
            'position' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', Rule::in(array_merge(['all'], self::STAFF_ROLES))],
        ]);

        $active = $filters['active'] ?? 'all';
        $position = $filters['position'] ?? 'all';
        $role = $filters['role'] ?? 'all';

        $query = Employee::with(['user.roles'])
            ->whereHas('user', function ($userQuery) {
                $userQuery->where('is_deleted', false);
            })
            ->orderBy('full_name');

        if ($active === 'active') {
            $query->where('is_active', true);
        } elseif ($active === 'inactive') {
            $query->where('is_active', false);
        }

        if ($position !== 'all') {
            $query->where('position_title', $position);
        }

        if ($role !== 'all') {
            $query->whereHas('user.roles', function ($roleQuery) use ($role) {
                $roleQuery->where('name', $role);
            });
        }

        $employees = $query->paginate(12)->withQueryString();
        $positions = Employee::query()
            ->whereHas('user', function ($userQuery) {
                $userQuery->where('is_deleted', false);
            })
            ->select('position_title')
            ->distinct()
            ->orderBy('position_title')
            ->pluck('position_title');

        $roles = Role::whereIn('name', self::STAFF_ROLES)->orderBy('name')->pluck('name');

        return view('hr.employees.index', [
            'employees' => $employees,
            'positions' => $positions,
            'roles' => $roles,
            'active' => $active,
            'position' => $position,
            'role' => $role,
            'canManageSalary' => $request->user()->can('hr.manage_salary'),
        ]);
    }

    public function create(Request $request): View
    {
        $this->authorizeManage($request);

        $roles = $this->assignableRoles();

        return view('hr.employees.create', [
            'roles' => $roles,
            'canManageSalary' => $request->user()->can('hr.manage_salary'),
            'defaultPassword' => self::DEFAULT_PASSWORD,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeManage($request);

        $data = $this->validateCreate($request);

        if ($data['user_role'] === self::ADMIN_ROLE) {
            return back()
                ->withErrors(['user_role' => 'Admin accounts can only be created during database seeding.'])
                ->withInput();
        }

        $user = $this->resolveUser($data);
        $employee = Employee::create($this->employeePayload($request, $data, $user->id));

        $this->logAudit($request->user()->id, 'employee.created', $employee->id, [
            'user_id' => $user->id,
            'role' => $this->resolveUserRole($user),
            'position_title' => $employee->position_title,
            'is_active' => $employee->is_active,
        ]);

        return redirect()
            ->route('hr.employees.index')
            ->with('success', 'Employee profile created.');
    }

    public function edit(Request $request, Employee $employee): View
    {
        $this->authorizeManage($request);

        $employee->load('user.roles');

        $roles = $this->assignableRoles($employee->user);

        return view('hr.employees.edit', [
            'employee' => $employee,
            'roles' => $roles,
            'currentRole' => $this->resolveUserRole($employee->user),
            'canManageSalary' => $request->user()->can('hr.manage_salary'),
        ]);
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorizeManage($request);

        $employee->load('user.roles');

        $data = $this->validateUpdate($request, $employee);

        $employeeOriginal = $employee->getAttributes();
        $user = $employee->user;
        $userOriginal = $user->getAttributes();
        $roleOriginal = $this->resolveUserRole($user);
        $role = $data['user_role'] ?? $roleOriginal;
        $targetIsAdmin = $this->isAdminUser($user);
        $adminCount = $this->adminCount();

        if (! $targetIsAdmin && $role === self::ADMIN_ROLE) {
            return back()
                ->withErrors(['user_role' => 'Admin accounts can only be created during database seeding.'])
                ->withInput();
        }

        if ($targetIsAdmin && $role !== self::ADMIN_ROLE && $adminCount <= 1) {
            return back()
                ->withErrors(['user_role' => 'The only admin account cannot be reassigned.'])
                ->withInput();
        }

        $userUpdate = [
            'name' => $data['user_name'],
            'email' => $data['user_email'],
        ];

        if (! empty($data['user_password'])) {
            $userUpdate['password'] = Hash::make($data['user_password']);
        }

        $user->update($userUpdate);

        if ($role && $role !== $roleOriginal) {
            $user->update(['role' => $role]);
            $user->syncRoles([$role]);
        }

        $employeePayload = $this->employeePayload($request, $data, $user->id, $employee);
        $employee->update($employeePayload);

        $changes = $this->buildEmployeeChanges($employee, $employeeOriginal);
        $userChanges = $this->buildUserChanges($user, $userOriginal, $roleOriginal);

        $this->logAudit($request->user()->id, 'employee.updated', $employee->id, array_merge($changes, $userChanges));

        return redirect()
            ->route('hr.employees.index')
            ->with('success', 'Employee profile updated.');
    }

    public function destroy(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorizeManage($request);

        $targetUser = $employee->user;
        if ($targetUser) {
            $targetIsAdmin = $this->isAdminUser($targetUser);
            $actorIsAdmin = $this->isAdminUser($request->user());

            if ($targetIsAdmin && $this->adminCount() <= 1) {
                return back()->with('error', 'The only admin account cannot be deleted.');
            }

            if ($targetIsAdmin && ! $actorIsAdmin) {
                return back()->with('error', 'Admin accounts can only be deleted by another admin.');
            }
        }

        try {
            $employeeId = $employee->id;
            $employee->update(['is_active' => false]);

            if ($targetUser && ! $targetUser->is_deleted) {
                $targetUser->update(['is_deleted' => true]);
            }

            $this->logAudit($request->user()->id, 'employee.deleted', $employeeId, []);
        } catch (QueryException $exception) {
            return back()->with('error', 'Employee cannot be deleted because it is in use.');
        }

        return redirect()
            ->route('hr.employees.index')
            ->with('success', 'Employee profile deleted.');
    }

    private function validateCreate(Request $request): array
    {
        return $request->validate([
            'user_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'user_role' => ['required', 'in:'.implode(',', self::STAFF_ROLES)],
            'user_password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'position_title' => ['required', 'string', 'max:255'],
            'hire_date' => ['required', 'date', 'before_or_equal:today'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ], [], [
            'user_name' => 'user name',
            'user_email' => 'user email',
            'user_role' => 'user role',
        ]);
    }

    private function validateUpdate(Request $request, Employee $employee): array
    {
        $userId = $employee->user_id;

        return $request->validate([
            'user_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'user_role' => ['required', 'in:'.implode(',', self::STAFF_ROLES)],
            'user_password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'position_title' => ['required', 'string', 'max:255'],
            'hire_date' => ['required', 'date', 'before_or_equal:today'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ], [], [
            'user_name' => 'user name',
            'user_email' => 'user email',
            'user_role' => 'user role',
        ]);
    }

    private function resolveUser(array $data): User
    {
        $password = $data['user_password'] ?: self::DEFAULT_PASSWORD;
        $role = $data['user_role'];

        $user = User::create([
            'name' => $data['user_name'],
            'email' => $data['user_email'],
            'password' => Hash::make($password),
            'role' => $role,
        ]);

        Role::firstOrCreate(['name' => $role]);
        $user->assignRole($role);

        return $user;
    }

    private function employeePayload(Request $request, array $data, int $userId, ?Employee $employee = null): array
    {
        $payload = [
            'user_id' => $userId,
            'full_name' => $data['full_name'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'position_title' => $data['position_title'],
            'hire_date' => $data['hire_date'],
            'is_active' => $request->boolean('is_active'),
        ];

        if ($request->user()->can('hr.manage_salary')) {
            $payload['salary'] = $data['salary'] ?? null;
        } elseif ($employee) {
            $payload['salary'] = $employee->salary;
        }

        return $payload;
    }

    private function resolveUserRole(User $user): ?string
    {
        return $user->getRoleNames()->first() ?? $user->role;
    }

    private function isAdminUser(User $user): bool
    {
        return $user->hasRole(self::ADMIN_ROLE) || $user->role === self::ADMIN_ROLE;
    }

    private function adminCount(): int
    {
        return User::query()
            ->where('is_deleted', false)
            ->where(function ($query) {
                $query->where('role', self::ADMIN_ROLE)
                    ->orWhereHas('roles', function ($roleQuery) {
                        $roleQuery->where('name', self::ADMIN_ROLE);
                    });
            })
            ->count();
    }

    private function assignableRoles(?User $user = null)
    {
        $roles = Role::whereIn('name', self::STAFF_ROLES)->orderBy('name');

        if ($user && $this->isAdminUser($user)) {
            if ($this->adminCount() <= 1) {
                $roles->where('name', self::ADMIN_ROLE);
            }
        } else {
            $roles->where('name', '!=', self::ADMIN_ROLE);
        }

        return $roles->pluck('name');
    }

    private function buildEmployeeChanges(Employee $employee, array $original): array
    {
        $fields = ['full_name', 'phone', 'address', 'position_title', 'hire_date', 'salary', 'is_active'];
        $changes = [];

        foreach ($fields as $field) {
            if ($employee->wasChanged($field)) {
                $changes[$field] = [
                    'from' => $original[$field] ?? null,
                    'to' => $employee->$field,
                ];
            }
        }

        return $changes;
    }

    private function buildUserChanges(User $user, array $original, ?string $roleOriginal): array
    {
        $changes = [];

        if ($user->wasChanged('name')) {
            $changes['user_name'] = [
                'from' => $original['name'] ?? null,
                'to' => $user->name,
            ];
        }

        if ($user->wasChanged('email')) {
            $changes['user_email'] = [
                'from' => $original['email'] ?? null,
                'to' => $user->email,
            ];
        }

        $roleCurrent = $this->resolveUserRole($user);
        if ($roleCurrent && $roleOriginal !== $roleCurrent) {
            $changes['user_role'] = [
                'from' => $roleOriginal,
                'to' => $roleCurrent,
            ];
        }

        return $changes;
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

    private function logAudit(int $userId, string $action, int $employeeId, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => 'employee',
            'entity_id' => $employeeId,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}
