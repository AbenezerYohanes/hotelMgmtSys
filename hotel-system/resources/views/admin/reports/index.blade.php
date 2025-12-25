@extends('layouts.app')

@section('title', 'Reports')

@section('content')
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
            <h1 class="h4 mb-1">Reports dashboard</h1>
            <p class="text-muted mb-0">Operational insights for {{ $today->format('M d, Y') }}.</p>
        </div>
        <a class="btn btn-outline-secondary" href="{{ route('admin.dashboard') }}">Back to admin</a>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-6 col-xl-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-muted small">Occupancy rate</div>
                    <div class="fs-4 fw-bold">{{ number_format($occupancyRate, 1) }}%</div>
                    <div class="text-muted small">
                        {{ $occupiedRoomsCount }} of {{ $activeRoomsCount }} rooms occupied
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-muted small">Revenue today</div>
                    <div class="fs-4 fw-bold">{{ number_format($revenueToday, 2) }}</div>
                    <div class="text-muted small">Invoices created today</div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-muted small">Arrivals today</div>
                    <div class="fs-4 fw-bold">{{ $arrivalsToday }}</div>
                    <div class="text-muted small">Confirmed or pending</div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-xl-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="text-muted small">Departures today</div>
                    <div class="fs-4 fw-bold">{{ $departuresToday }}</div>
                    <div class="text-muted small">Scheduled check-outs</div>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-3">
        <div class="col-lg-6">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">Month-to-date revenue</h2>
                    <div class="fs-4 fw-bold">{{ number_format($revenueMonth, 2) }}</div>
                    <div class="text-muted small">From {{ $monthStart->format('M d') }} to today</div>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h2 class="h6">Average occupancy (MTD)</h2>
                    <div class="fs-4 fw-bold">{{ number_format($averageOccupancy, 1) }}%</div>
                    <div class="text-muted small">Average daily occupied rooms this month</div>
                </div>
            </div>
        </div>
    </div>
@endsection
