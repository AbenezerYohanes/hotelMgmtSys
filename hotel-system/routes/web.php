<?php

use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\RoomTypeController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\Guest\BookingController as GuestBookingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('home');
Route::post('/quick-book', [LandingController::class, 'quickBook'])->name('quick-book');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->name('attendance.clock-in');
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut'])->name('attendance.clock-out');

    Route::middleware('role:Guest|Admin')->group(function () {
        Route::get('/bookings', [GuestBookingController::class, 'search'])->name('guest.bookings.search');
        Route::post('/bookings', [GuestBookingController::class, 'store'])->name('guest.bookings.store');
        Route::get('/my-bookings', [GuestBookingController::class, 'index'])->name('guest.bookings.index');
        Route::patch('/bookings/{booking}/cancel', [GuestBookingController::class, 'cancel'])->name('guest.bookings.cancel');
    });

    Route::middleware('role:FrontDesk|Admin')->prefix('frontdesk')->as('frontdesk.')->group(function () {
        Route::get('/', [\App\Http\Controllers\FrontDesk\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/calendar', [\App\Http\Controllers\FrontDesk\DashboardController::class, 'calendar'])->name('calendar');

        Route::get('/bookings/create', [\App\Http\Controllers\FrontDesk\BookingController::class, 'create'])->name('bookings.create');
        Route::post('/bookings', [\App\Http\Controllers\FrontDesk\BookingController::class, 'store'])->name('bookings.store');
        Route::get('/bookings/{booking}', [\App\Http\Controllers\FrontDesk\BookingController::class, 'show'])->name('bookings.show');
        Route::patch('/bookings/{booking}/confirm', [\App\Http\Controllers\FrontDesk\BookingController::class, 'confirm'])->name('bookings.confirm');
        Route::patch('/bookings/{booking}/cancel', [\App\Http\Controllers\FrontDesk\BookingController::class, 'cancel'])->name('bookings.cancel');
        Route::patch('/bookings/{booking}/check-in', [\App\Http\Controllers\FrontDesk\BookingController::class, 'checkIn'])->name('bookings.checkin');
        Route::patch('/bookings/{booking}/check-out', [\App\Http\Controllers\FrontDesk\BookingController::class, 'checkOut'])->name('bookings.checkout');

        Route::get('/invoices/{invoice}', [\App\Http\Controllers\FrontDesk\InvoiceController::class, 'show'])->name('invoices.show');
        Route::get('/invoices/{invoice}/print', [\App\Http\Controllers\FrontDesk\InvoiceController::class, 'print'])->name('invoices.print');
        Route::patch('/invoices/{invoice}/payment-status', [\App\Http\Controllers\FrontDesk\InvoiceController::class, 'updateStatus'])->name('invoices.update-status');

        Route::patch('/rooms/{room}/out-of-service', [\App\Http\Controllers\FrontDesk\RoomController::class, 'markOutOfService'])->name('rooms.out-of-service');
    });

    Route::middleware('role:FrontDesk|Housekeeper|HRManager|Admin')->prefix('maintenance')->as('maintenance.')->group(function () {
        Route::get('/issues/create', [\App\Http\Controllers\Maintenance\IssueController::class, 'create'])->name('issues.create');
        Route::post('/issues', [\App\Http\Controllers\Maintenance\IssueController::class, 'store'])->name('issues.store');
    });

    Route::middleware('role:FrontDesk|Admin')->prefix('maintenance')->as('maintenance.')->group(function () {
        Route::get('/issues', [\App\Http\Controllers\Maintenance\IssueController::class, 'index'])->name('issues.index');
        Route::patch('/issues/{issue}', [\App\Http\Controllers\Maintenance\IssueController::class, 'update'])->name('issues.update');
    });

    Route::middleware('role:Housekeeper|Admin')->prefix('housekeeping')->as('housekeeping.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Housekeeping\DashboardController::class, 'index'])->name('dashboard');
        Route::patch('/assignments/{assignment}/status', [\App\Http\Controllers\Housekeeping\DashboardController::class, 'updateStatus'])->name('assignments.status');
    });

    Route::middleware('role:FrontDesk|Admin')->prefix('housekeeping')->as('housekeeping.')->group(function () {
        Route::get('/assignments', [\App\Http\Controllers\Housekeeping\AssignmentController::class, 'index'])->name('assignments.index');
        Route::post('/assignments', [\App\Http\Controllers\Housekeeping\AssignmentController::class, 'store'])->name('assignments.store');
    });

    Route::middleware('role:HRManager|Admin')->prefix('hr')->as('hr.')->group(function () {
        Route::get('/', [\App\Http\Controllers\HR\EmployeeController::class, 'index'])->name('dashboard');
        Route::get('/employees', [\App\Http\Controllers\HR\EmployeeController::class, 'index'])->name('employees.index');
        Route::get('/employees/create', [\App\Http\Controllers\HR\EmployeeController::class, 'create'])->name('employees.create');
        Route::post('/employees', [\App\Http\Controllers\HR\EmployeeController::class, 'store'])->name('employees.store');
        Route::get('/employees/{employee}/edit', [\App\Http\Controllers\HR\EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/employees/{employee}', [\App\Http\Controllers\HR\EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/employees/{employee}', [\App\Http\Controllers\HR\EmployeeController::class, 'destroy'])->name('employees.destroy');
        Route::get('/schedule', [\App\Http\Controllers\HR\ShiftScheduleController::class, 'index'])->name('schedule.index');
        Route::post('/schedule', [\App\Http\Controllers\HR\ShiftScheduleController::class, 'store'])->name('schedule.store');
        Route::get('/schedule/{assignment}/edit', [\App\Http\Controllers\HR\ShiftScheduleController::class, 'edit'])->name('schedule.edit');
        Route::put('/schedule/{assignment}', [\App\Http\Controllers\HR\ShiftScheduleController::class, 'update'])->name('schedule.update');
        Route::delete('/schedule/{assignment}', [\App\Http\Controllers\HR\ShiftScheduleController::class, 'destroy'])->name('schedule.destroy');
        Route::get('/attendance', [\App\Http\Controllers\HR\AttendanceController::class, 'index'])->name('attendance.index');
    });

    Route::middleware('role:Admin')->prefix('admin')->as('admin.')->group(function () {
        Route::view('/', 'modules.admin')->name('dashboard');
        Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
        Route::get('bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
        Route::get('audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::resource('room-types', RoomTypeController::class)->except('show');
        Route::patch('room-types/{room_type}/toggle', [RoomTypeController::class, 'toggle'])->name('room-types.toggle');
        Route::resource('rooms', RoomController::class)->except('show');
        Route::get('reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
    });
});

require __DIR__.'/auth.php';

