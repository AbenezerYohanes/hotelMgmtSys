<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->decimal('price_per_night', 10, 2);
            $table->unsignedSmallInteger('max_occupancy');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number', 20)->unique();
            $table->foreignId('room_type_id')->constrained()->restrictOnDelete();
            $table->unsignedSmallInteger('floor')->index();
            $table->enum('status', ['clean', 'dirty', 'out_of_service'])->default('clean')->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code', 30)->unique();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('room_id')->constrained()->restrictOnDelete();
            $table->date('check_in_date')->index();
            $table->date('check_out_date')->index();
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])
                ->default('pending')
                ->index();
            $table->unsignedSmallInteger('adults')->default(1);
            $table->unsignedSmallInteger('children')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['room_id', 'check_in_date']);
            $table->index(['user_id', 'status']);
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('invoice_number', 30)->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid')->index();
            $table->timestamps();
        });

        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->string('description');
            $table->unsignedInteger('qty');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('line_total', 10, 2);
            $table->timestamps();

            $table->index('invoice_id');
        });

        Schema::create('maintenance_issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->restrictOnDelete();
            $table->foreignId('reported_by_user_id')->constrained('users')->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium')->index();
            $table->enum('status', ['open', 'in_progress', 'resolved'])->default('open')->index();
            $table->foreignId('resolved_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable()->index();
            $table->timestamps();

            $table->index(['room_id', 'status']);
        });

        Schema::create('housekeeping_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->restrictOnDelete();
            $table->foreignId('housekeeper_user_id')->constrained('users')->restrictOnDelete();
            $table->date('assigned_date')->index();
            $table->enum('status', ['assigned', 'done'])->default('assigned')->index();
            $table->timestamps();

            $table->index(['room_id', 'assigned_date']);
            $table->index(['housekeeper_user_id', 'assigned_date']);
        });

        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->restrictOnDelete();
            $table->string('full_name');
            $table->string('phone', 30);
            $table->string('address', 255);
            $table->string('position_title');
            $table->date('hire_date');
            $table->decimal('salary', 12, 2)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();

            $table->index('position_title');
        });

        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->enum('name', ['Morning', 'Evening', 'Night'])->unique();
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        Schema::create('shift_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shift_id')->constrained()->cascadeOnDelete();
            $table->date('work_date')->index();
            $table->timestamps();

            $table->unique(['employee_id', 'shift_id', 'work_date']);
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('clock_in_time')->nullable();
            $table->time('clock_out_time')->nullable();
            $table->enum('status', ['present', 'absent', 'late'])->default('present')->index();
            $table->timestamps();

            $table->unique(['employee_id', 'date']);
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('action');
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();

            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('shift_assignments');
        Schema::dropIfExists('shifts');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('housekeeping_assignments');
        Schema::dropIfExists('maintenance_issues');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('room_types');
    }
};
