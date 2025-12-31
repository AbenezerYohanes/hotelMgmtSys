<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->boolean('room_type_inactive')->default(false)->index()->after('is_active');
            $table->enum('room_type_prev_status', ['clean', 'dirty', 'out_of_service'])->nullable()->after('room_type_inactive');
            $table->boolean('room_type_prev_is_active')->nullable()->after('room_type_prev_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn('room_type_inactive');
            $table->dropColumn('room_type_prev_status');
            $table->dropColumn('room_type_prev_is_active');
        });
    }
};
