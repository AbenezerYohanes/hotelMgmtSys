<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoomController extends Controller
{
    private const STATUSES = ['clean', 'dirty', 'out_of_service'];

    public function index(Request $request): View
    {
        $active = $request->input('active', 'all');
        $status = $request->input('status');
        $roomTypeId = $request->input('room_type_id');

        $query = Room::with('roomType')->orderBy('room_number');

        if ($active === 'active') {
            $query->where('is_active', true);
        } elseif ($active === 'inactive') {
            $query->where('is_active', false);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($roomTypeId) {
            $query->where('room_type_id', $roomTypeId);
        }

        $rooms = $query->paginate(10)->withQueryString();
        $roomTypes = RoomType::orderBy('name')->get(['id', 'name']);

        return view('admin.rooms.index', [
            'rooms' => $rooms,
            'roomTypes' => $roomTypes,
            'statuses' => self::STATUSES,
            'active' => $active,
            'status' => $status,
            'roomTypeId' => $roomTypeId,
        ]);
    }

    public function create(): View
    {
        return view('admin.rooms.create', [
            'room' => new Room(),
            'roomTypes' => RoomType::orderBy('name')->get(['id', 'name']),
            'statuses' => self::STATUSES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateRoom($request);
        $data['is_active'] = $request->boolean('is_active');

        $room = Room::create($data);

        $this->logAudit($request->user()->id, 'room.created', $room->id, [
            'room_number' => $room->room_number,
            'room_type_id' => $room->room_type_id,
            'floor' => $room->floor,
            'status' => $room->status,
            'is_active' => $room->is_active,
        ]);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Room created successfully.');
    }

    public function edit(Room $room): View
    {
        return view('admin.rooms.edit', [
            'room' => $room,
            'roomTypes' => RoomType::orderBy('name')->get(['id', 'name']),
            'statuses' => self::STATUSES,
        ]);
    }

    public function update(Request $request, Room $room): RedirectResponse
    {
        $data = $this->validateRoom($request, $room->id);
        $data['is_active'] = $request->boolean('is_active');

        $room->update($data);

        $this->logAudit($request->user()->id, 'room.updated', $room->id, [
            'room_number' => $room->room_number,
            'room_type_id' => $room->room_type_id,
            'floor' => $room->floor,
            'status' => $room->status,
            'is_active' => $room->is_active,
        ]);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Room updated successfully.');
    }

    public function destroy(Room $room): RedirectResponse
    {
        try {
            $roomId = $room->id;
            $roomNumber = $room->room_number;
            $room->delete();

            $this->logAudit($request->user()->id, 'room.deleted', $roomId, [
                'room_number' => $roomNumber,
            ]);
        } catch (QueryException $exception) {
            return back()->with('error', 'Room cannot be deleted because it is in use.');
        }

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Room deleted successfully.');
    }

    private function validateRoom(Request $request, ?int $roomId = null): array
    {
        $uniqueRule = $roomId
            ? 'unique:rooms,room_number,'.$roomId
            : 'unique:rooms,room_number';

        return $request->validate([
            'room_number' => ['required', 'string', 'max:20', $uniqueRule],
            'room_type_id' => ['required', 'exists:room_types,id'],
            'floor' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:'.implode(',', self::STATUSES)],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    private function logAudit(int $userId, string $action, int $roomId, array $meta): void
    {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => 'room',
            'entity_id' => $roomId,
            'meta' => $meta,
            'created_at' => now(),
        ]);
    }
}
