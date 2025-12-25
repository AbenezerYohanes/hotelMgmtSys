<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HousekeepingAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'housekeeper_user_id',
        'assigned_date',
        'status',
    ];

    protected $casts = [
        'assigned_date' => 'date',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function housekeeper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'housekeeper_user_id');
    }
}
