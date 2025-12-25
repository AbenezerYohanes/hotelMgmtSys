<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    public static function generateNumber(): string
    {
        $year = now()->format('Y');

        do {
            $number = 'INV-'.$year.'-'.str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        } while (self::where('invoice_number', $number)->exists());

        return $number;
    }

    protected $fillable = [
        'booking_id',
        'invoice_number',
        'subtotal',
        'tax',
        'total',
        'payment_status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
