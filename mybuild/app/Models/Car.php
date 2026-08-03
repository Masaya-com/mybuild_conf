<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    protected $fillable = [
        'maker_id', 'model', 'year', 'grade', 'body_type',
        'engine_name', 'engine_type', 'displacement_cc',
        'max_power_ps', 'max_power_rpm',
        'max_torque_nm', 'max_torque_rpm',
        'top_speed_kmh', 'acceleration_0_100_sec',
        'fuel_type', 'fuel_efficiency_km_per_l',
        'drive_type', 'transmission',
        'weight_kg', 'wheelbase_mm',
        'suspension_front', 'suspension_rear',
        'brake_front', 'brake_rear',
        'tire_size_front', 'tire_size_rear',
        'handling_score', 'braking_distance_100_0_m',
        'price_man_yen', 'seating_capacity',
    ];

    protected $casts = [
        'acceleration_0_100_sec' => 'float',
        'fuel_efficiency_km_per_l' => 'float',
        'handling_score' => 'float',
    ];

    public function maker(): BelongsTo
    {
        return $this->belongsTo(Maker::class);
    }

    public function parts(): BelongsToMany
    {
        return $this->belongsToMany(Part::class, 'car_parts');
    }

    public function userFavorites(): HasMany
    {
        return $this->hasMany(UserFavorite::class);
    }
}
