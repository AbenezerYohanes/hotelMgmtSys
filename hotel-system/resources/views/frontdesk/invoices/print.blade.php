@extends('layouts.print')

@section('title', 'Invoice '.$invoice->invoice_number)

@section('content')
    @php
        $booking = $invoice->booking;
        $room = $booking?->room;
        $guest = $booking?->guest;
        $taxRate = (float) config('ihms.tax_rate', 0);
        $statusBadge = match ($invoice->payment_status) {
            'paid' => 'badge-paid',
            'partial' => 'badge-partial',
            default => 'badge-unpaid',
        };
    @endphp

    <button class="no-print" type="button" onclick="window.print()">Print</button>

    <h1>Invoice {{ $invoice->invoice_number }}</h1>
    <p class="text-muted">Booking {{ $booking?->booking_code }}</p>

    <table class="table">
        <tr>
            <td>
                <strong>Guest</strong><br>
                {{ $guest?->name ?? 'N/A' }}<br>
                <span class="text-muted">{{ $guest?->email ?? 'N/A' }}</span>
            </td>
            <td>
                <strong>Room</strong><br>
                {{ $room?->room_number ?? 'N/A' }}<br>
                <span class="text-muted">{{ $room?->roomType?->name ?? 'N/A' }}</span>
            </td>
            <td>
                <strong>Dates</strong><br>
                {{ $booking?->check_in_date?->format('M d, Y') }} to {{ $booking?->check_out_date?->format('M d, Y') }}
            </td>
            <td>
                <strong>Status</strong><br>
                <span class="badge {{ $statusBadge }}">{{ ucfirst($invoice->payment_status) }}</span>
            </td>
        </tr>
    </table>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-end">Qty</th>
                <th class="text-end">Unit price</th>
                <th class="text-end">Line total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td class="text-end">{{ $item->qty }}</td>
                    <td class="text-end">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-end">{{ number_format($item->line_total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="table" style="max-width: 320px; margin-left: auto;">
        <tr>
            <th>Subtotal</th>
            <td class="text-end">{{ number_format($invoice->subtotal, 2) }}</td>
        </tr>
        <tr>
            <th>Tax{{ $taxRate > 0 ? ' ('.number_format($taxRate * 100, 2).'%)' : '' }}</th>
            <td class="text-end">{{ number_format($invoice->tax, 2) }}</td>
        </tr>
        <tr>
            <th>Total</th>
            <td class="text-end">{{ number_format($invoice->total, 2) }}</td>
        </tr>
    </table>

    <p class="text-muted">Printed {{ $printedAt->format('M d, Y H:i') }}</p>
@endsection
