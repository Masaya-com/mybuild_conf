<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('maker_id')->constrained('makers')->cascadeOnDelete();
            $table->string('model');
            $table->smallInteger('year');
            $table->string('grade');
            $table->string('body_type');
            $table->string('engine_name');
            $table->string('engine_type');
            $table->integer('displacement_cc');
            $table->integer('max_power_ps');
            $table->integer('max_power_rpm');
            $table->integer('max_torque_nm');
            $table->integer('max_torque_rpm');
            $table->integer('top_speed_kmh');
            $table->decimal('acceleration_0_100_sec', 4, 1);
            $table->string('fuel_type');
            $table->decimal('fuel_efficiency_km_per_l', 4, 1);
            $table->string('drive_type');
            $table->string('transmission');
            $table->integer('weight_kg');
            $table->integer('wheelbase_mm');
            $table->string('suspension_front');
            $table->string('suspension_rear');
            $table->string('brake_front');
            $table->string('brake_rear');
            $table->string('tire_size_front');
            $table->string('tire_size_rear');
            $table->decimal('handling_score', 3, 1);
            $table->integer('braking_distance_100_0_m');
            $table->integer('price_man_yen');
            $table->smallInteger('seating_capacity');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
