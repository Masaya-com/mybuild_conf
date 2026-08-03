<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->string('part_category');
            $table->string('part_name');
            $table->string('part_maker');
            $table->string('grade');
            $table->integer('price_yen');
            $table->integer('power_delta_ps')->default(0);
            $table->integer('torque_delta_nm')->default(0);
            $table->decimal('acceleration_delta_sec', 4, 2)->default(0);
            $table->integer('top_speed_delta_kmh')->default(0);
            $table->decimal('fuel_efficiency_delta', 4, 1)->default(0);
            $table->integer('weight_delta_kg')->default(0);
            $table->decimal('handling_score_delta', 3, 1)->default(0);
            $table->integer('braking_distance_delta_m')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parts');
    }
};
