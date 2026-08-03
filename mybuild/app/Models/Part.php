<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Part extends Model
{
    protected $fillable = [
        'part_category', 'part_name', 'part_maker', 'grade', 'price_yen',
        'power_delta_ps', 'torque_delta_nm', 'acceleration_delta_sec',
        'top_speed_delta_kmh', 'fuel_efficiency_delta',
        'weight_delta_kg', 'handling_score_delta', 'braking_distance_delta_m',
        'description',
    ];

    protected $casts = [
        'acceleration_delta_sec' => 'float',
        'fuel_efficiency_delta' => 'float',
        'handling_score_delta' => 'float',
    ];

    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class, 'car_parts');
    }
}
