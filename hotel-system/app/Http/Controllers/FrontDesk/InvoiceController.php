<?php

namespace App\Http\Controllers\FrontDesk;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class InvoiceController extends Controller
{
    public function show(Request $request, Invoice $invoice): View
    {
        $this->authorizeView($request);

        $invoice->load(['booking.guest', 'booking.room.roomType', 'items']);

        return view('frontdesk.invoices.show', [
            'invoice' => $invoice,
        ]);
    }

    public function print(Request $request, Invoice $invoice): View
    {
        $this->authorizeView($request);

        $invoice->load(['booking.guest', 'booking.room.roomType', 'items']);

        return view('frontdesk.invoices.print', [
            'invoice' => $invoice,
            'printedAt' => now(),
        ]);
    }

    public function updateStatus(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorizeManage($request);

        $data = $request->validate([
            'payment_status' => ['required', 'in:unpaid,partial,paid'],
        ], [], [
            'payment_status' => 'payment status',
        ]);

        $statusWas = $invoice->payment_status;
        $invoice->update(['payment_status' => $data['payment_status']]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'invoice.payment_status_updated',
            'entity_type' => 'invoice',
            'entity_id' => $invoice->id,
            'meta' => [
                'from' => $statusWas,
                'to' => $invoice->payment_status,
                'invoice_number' => $invoice->invoice_number,
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', 'Payment status updated.');
    }

    private function authorizeView(Request $request): void
    {
        if (! $request->user()->can('frontdesk.view')) {
            abort(403);
        }
    }

    private function authorizeManage(Request $request): void
    {
        if (! $request->user()->can('frontdesk.manage')) {
            abort(403);
        }
    }
}
