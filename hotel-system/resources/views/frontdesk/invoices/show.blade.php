@extends('layouts.app')

@section('title', 'Invoice '.$invoice->invoice_number)

@section('content')
    @php
        $booking = $invoice->booking;
        $room = $booking?->room;
        $guest = $booking?->guest;
        $statusClass = match ($invoice->payment_status) {
            'paid' => 'bg-success',
            'partial' => 'bg-warning text-dark',
            default => 'bg-secondary',
        };
        $taxRate = (float) config('ihms.tax_rate', 0);
    @endphp

    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Invoice {{ $invoice->invoice_number }}</h1>
            <p class="text-muted mb-0">Booking {{ $booking?->booking_code }}</p>
        </div>
        <div class="d-flex gap-2">
            <a class="btn btn-outline-secondary" href="{{ route('frontdesk.bookings.show', $booking) }}">Back to booking</a>
            <a class="btn btn-outline-primary" href="{{ route('frontdesk.invoices.print', $invoice) }}" target="_blank" rel="noopener">Print</a>
        </div>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-lg-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-muted small">Guest</div>
                    <div class="fw-semibold">{{ $guest?->name ?? 'N/A' }}</div>
                    <div class="text-muted">{{ $guest?->email ?? 'N/A' }}</div>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-muted small">Room</div>
                    <div class="fw-semibold">{{ $room?->room_number ?? 'N/A' }}</div>
                    <div class="text-muted">{{ $room?->roomType?->name ?? 'N/A' }}</div>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-muted small">Payment status</div>
                    <span class="badge {{ $statusClass }}">
                        {{ ucfirst($invoice->payment_status) }}
                    </span>
                    <div class="text-muted small mt-2">Totals</div>
                    <div class="fw-semibold">{{ number_format($invoice->total, 2) }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="card shadow-sm mb-4 ihms-table-card">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h6 mb-0">Invoice items</h2>
                <span class="text-muted small">
                    {{ $booking?->check_in_date?->format('M d, Y') }} to {{ $booking?->check_out_date?->format('M d, Y') }}
                </span>
            </div>
            <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                    <thead class="table-light">
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
            </div>

            <div class="d-flex justify-content-end mt-4">
                <div class="text-end">
                    <div class="text-muted small">Subtotal</div>
                    <div class="fw-semibold mb-2">{{ number_format($invoice->subtotal, 2) }}</div>
                    <div class="text-muted small">Tax{{ $taxRate > 0 ? ' ('.number_format($taxRate * 100, 2).'%)' : '' }}</div>
                    <div class="fw-semibold mb-2">{{ number_format($invoice->tax, 2) }}</div>
                    <div class="text-muted small">Total</div>
                    <div class="fw-bold fs-5">{{ number_format($invoice->total, 2) }}</div>
                </div>
            </div>
        </div>
    </div>

    @can('frontdesk.manage')
        <div class="card shadow-sm">
            <div class="card-body">
                <h2 class="h6">Update payment status</h2>
                <form method="POST" action="{{ route('frontdesk.invoices.update-status', $invoice) }}" class="row g-3 align-items-end">
                    @csrf
                    @method('PATCH')
                    <div class="col-md-4">
                        <x-form.select
                            name="payment_status"
                            label="Payment status"
                            :options="['unpaid' => 'Unpaid', 'partial' => 'Partial', 'paid' => 'Paid']"
                            :selected="$invoice->payment_status"
                            required
                        />
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-primary" type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    @endcan
@endsection
