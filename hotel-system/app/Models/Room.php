<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_number',
        'room_type_id',
        'floor',
        'status',
        'is_active',
        'room_type_inactive',
        'room_type_prev_status',
        'room_type_prev_is_active',
    ];

    protected $casts = [
        'floor' => 'integer',
        'is_active' => 'boolean',
        'room_type_inactive' => 'boolean',
        'room_type_prev_is_active' => 'boolean',
    ];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function maintenanceIssues(): HasMany
    {
        return $this->hasMany(MaintenanceIssue::class);
    }

    public function housekeepingAssignments(): HasMany
    {
        return $this->hasMany(HousekeepingAssignment::class);
    }
}
