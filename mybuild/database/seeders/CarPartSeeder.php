<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Part;
use Illuminate\Database\Seeder;

class CarPartSeeder extends Seeder
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

            $part = Part::where('part_name', $data['part_name'])
                ->where('part_maker', $data['part_maker'])
                ->first();

            if (! $part) {
                continue;
            }

            // compatible_models は "|" 区切りで複数モデルを持てる
            $models = explode('|', $data['compatible_models']);

            foreach ($models as $modelName) {
                $modelName = trim($modelName);
                $cars = Car::whereHas('maker', fn ($q) => $q->where('name_en', 'Toyota'))
                    ->where('model', $modelName)
                    ->get();

                foreach ($cars as $car) {
                    $car->parts()->syncWithoutDetaching([$part->id]);
                }
            }
        }

        fclose($handle);
        $this->command->info('Car-Part relations seeded successfully.');
    }
}
