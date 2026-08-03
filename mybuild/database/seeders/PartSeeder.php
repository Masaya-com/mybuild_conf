<?php

namespace Database\Seeders;

use App\Models\Part;
use Illuminate\Database\Seeder;

class PartSeeder extends Seeder
{
    public function run(): void
    {
        $csvPath = storage_path('app/car_data/toyota_parts.csv');

        if (! file_exists($csvPath)) {
            $this->command->warn("CSV not found: {$csvPath}");
            return;
        }

        $handle = fopen($csvPath, 'r');
        $headers = fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($headers, $row);

            Part::updateOrCreate(
                ['part_name' => $data['part_name'], 'part_maker' => $data['part_maker']],
                [
                    'part_category'          => $data['part_category'],
                    'grade'                  => $data['grade'],
                    'price_yen'              => (int) $data['price_yen'],
                    'power_delta_ps'         => (int) $data['power_delta_ps'],
                    'torque_delta_nm'        => (int) $data['torque_delta_nm'],
                    'acceleration_delta_sec' => (float) $data['acceleration_delta_sec'],
                    'top_speed_delta_kmh'    => (int) $data['top_speed_delta_kmh'],
                    'fuel_efficiency_delta'  => (float) $data['fuel_efficiency_delta_km_per_l'],
                    'weight_delta_kg'        => (int) $data['weight_delta_kg'],
                    'handling_score_delta'   => (float) $data['handling_score_delta'],
                    'braking_distance_delta_m' => (int) $data['braking_distance_delta_m'],
                    'description'            => $data['description'],
                ]
            );
        }

        fclose($handle);
        $this->command->info('Parts seeded successfully.');
    }
}
