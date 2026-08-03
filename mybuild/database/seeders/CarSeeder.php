<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Maker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        $csvPath = storage_path('app/car_data/toyota_cars.csv');

        if (! file_exists($csvPath)) {
            $this->command->warn("CSV not found: {$csvPath}");
            return;
        }

        $handle = fopen($csvPath, 'r');
        $headers = fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($headers, $row);

            $maker = Maker::where('name_en', $data['maker'])->first();
            if (! $maker) {
                continue;
            }

            Car::updateOrCreate(
                [
                    'maker_id' => $maker->id,
                    'model'    => $data['model'],
                    'year'     => (int) $data['year'],
                    'grade'    => $data['grade'],
                ],
                [
                    'body_type'                => $data['body_type'],
                    'engine_name'              => $data['engine_name'],
                    'engine_type'              => $data['engine_type'],
                    'displacement_cc'          => (int) $data['displacement_cc'],
                    'max_power_ps'             => (int) $data['max_power_ps'],
                    'max_power_rpm'            => (int) $data['max_power_rpm'],
                    'max_torque_nm'            => (int) $data['max_torque_nm'],
                    'max_torque_rpm'           => (int) $data['max_torque_rpm'],
                    'top_speed_kmh'            => (int) $data['top_speed_kmh'],
                    'acceleration_0_100_sec'   => (float) $data['acceleration_0_100_sec'],
                    'fuel_type'                => $data['fuel_type'],
                    'fuel_efficiency_km_per_l' => (float) $data['fuel_efficiency_km_per_l'],
                    'drive_type'               => $data['drive_type'],
                    'transmission'             => $data['transmission'],
                    'weight_kg'                => (int) $data['weight_kg'],
                    'wheelbase_mm'             => (int) $data['wheelbase_mm'],
                    'suspension_front'         => $data['suspension_front'],
                    'suspension_rear'          => $data['suspension_rear'],
                    'brake_front'              => $data['brake_front'],
                    'brake_rear'               => $data['brake_rear'],
                    'tire_size_front'          => $data['tire_size_front'],
                    'tire_size_rear'           => $data['tire_size_rear'],
                    'handling_score'           => (float) $data['handling_score'],
                    'braking_distance_100_0_m' => (int) $data['braking_distance_100_0_m'],
                    'price_man_yen'            => (int) $data['price_man_yen'],
                    'seating_capacity'         => (int) $data['seating_capacity'],
                ]
            );
        }

        fclose($handle);
        $this->command->info('Cars seeded successfully.');
    }
}
