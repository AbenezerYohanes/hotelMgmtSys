<?php

namespace App\Http\Controllers\FrontDesk;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function markOutOfService(Request $request, Room $room): RedirectResponse
    {
        if (! $request->user()->can('rooms.manage_status')) {
            abort(403);
        }

        $statusWas = $room->status;
        $room->update(['status' => 'out_of_service']);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'room.out_of_service',
            'entity_type' => 'room',
            'entity_id' => $room->id,
            'meta' => [
                'from' => $statusWas,
                'to' => 'out_of_service',
                'room_number' => $room->room_number,
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', "Room {$room->room_number} marked out of service.");
    }
}
