<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\RoomType;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoomTypeController extends Controller
{
    public function index(Request $request): View
    {
        $active = $request->input('active', 'all');
        $query = RoomType::query();

        if ($active === 'active') {
            $query->where('is_active', true);
        } elseif ($active === 'inactive') {
            $query->where('is_active', false);
        }

        $roomTypes = $query->orderBy('name')->paginate(10)->withQueryString();

        return view('admin.room-types.index', [
            'roomTypes' => $roomTypes,
            'active' => $active,
        ]);
    }

    public function create(): View
    {
        return view('admin.room-types.create', [
            'roomType' => new RoomType(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateRoomType($request);
        $data['is_active'] = $request->boolean('is_active');

        $roomType = RoomType::create($data);

        $this->logAudit($request->user()->id, 'room_type.created', $roomType->id, [
            'name' => $roomType->name,
            'price_per_night' => $roomType->price_per_night,
            'max_occupancy' => $roomType->max_occupancy,
            'is_active' => $roomType->is_active,
        ]);

        return redirect()
            ->route('admin.room-types.index')
            ->with('success', 'Room type created successfully.');
    }

    public function edit(RoomType $roomType): View
    {
        return view('admin.room-types.edit', [
            'roomType' => $roomType,
        ]);
    }

    public function update(Request $request, RoomType $roomType): RedirectResponse
    {
        $data = $this->validateRoomType($request, $roomType->id);
        $data['is_active'] = $request->boolean('is_active');

        $roomType->update($data);

        $this->logAudit($request->user()->id, 'room_type.updated', $roomType->id, [
            'name' => $roomType->name,
            'price_per_night' => $roomType->price_per_night,
            'max_occupancy' => $roomType->max_occupancy,
            'is_active' => $roomType->is_active,
        ]);

        return redirect()
            ->route('admin.room-types.index')
            ->with('success', 'Room type updated successfully.');
    }

    public function destroy(RoomType $roomType): RedirectResponse
    {
        try {
            $roomTypeId = $roomType->id;
            $roomTypeName = $roomType->name;
            $roomType->delete();

            $this->logAudit($request->user()->id, 'room_type.deleted', $roomTypeId, [
                'name' => $roomTypeName,
            ]);
        } catch (QueryException $exception) {
            return back()->with('error', 'Room type cannot be deleted because it is in use.');
        }

        return redirect()
            ->route('admin.room-types.index')
            ->with('success', 'Room type deleted successfully.');
    }

    public function toggle(Request $request, RoomType $roomType): RedirectResponse
    {
        $statusWas = $roomType->is_active;
        $roomType->update([
            'is_active' => ! $roomType->is_active,
        ]);

        $this->logAudit($request->user()->id, 'room_type.toggled', $roomType->id, [
            'from' => $statusWas,
            'to' => $roomType->is_active,
        ]);

        return back()->with('success', 'Room type status updated.');
    }

    private function validateRoomType(Request $request, ?int $roomTypeId = null): array
    {
        $uniqueRule = $roomTypeId
            ? 'unique:room_types,name,'.$roomTypeId
            : 'unique:room_types,name';

        return $request->validate([
            'name' => ['required', 'string', 'max:255', $uniqueRule],
            'description' => ['nullable', 'string'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'max_occupancy' => ['required', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    private function logAudit(int $userId, string $action, int $roomTypeId, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => 'room_type',
            'entity_id' => $roomTypeId,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}
