<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;

class Booking extends Model
{
    use HasFactory;

    public const STATUSES = [
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
    ];

    protected $fillable = [
        'booking_code',
        'user_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'status',
        'adults',
        'children',
        'notes',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'adults' => 'integer',
        'children' => 'integer',
    ];

    public function scopeOverlapping(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->where('check_in_date', '<', $endDate)
            ->where('check_out_date', '>', $startDate);
    }

    public static function generateCode(): string
    {
        $year = now()->format('Y');

        do {
            $code = 'HEAVEN-'.$year.'-'.str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        } while (self::where('booking_code', $code)->exists());

        return $code;
    }

    public function isCancellable(): bool
    {
        return in_array($this->status, ['pending', 'confirmed'], true);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
