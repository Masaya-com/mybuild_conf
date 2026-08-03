<?php

namespace Database\Seeders;

use App\Models\Maker;
use Illuminate\Database\Seeder;

class MakerSeeder extends Seeder
{
    public function run(): void
    {
        $makers = [
            ['name' => 'トヨタ',           'name_en' => 'Toyota',       'country' => '日本'],
            ['name' => 'ホンダ',           'name_en' => 'Honda',        'country' => '日本'],
            ['name' => '日産',             'name_en' => 'Nissan',       'country' => '日本'],
            ['name' => 'マツダ',           'name_en' => 'Mazda',        'country' => '日本'],
            ['name' => 'スバル',           'name_en' => 'Subaru',       'country' => '日本'],
            ['name' => 'BMW',             'name_en' => 'BMW',          'country' => 'ドイツ'],
            ['name' => 'メルセデス・ベンツ', 'name_en' => 'Mercedes',     'country' => 'ドイツ'],
            ['name' => 'ポルシェ',         'name_en' => 'Porsche',      'country' => 'ドイツ'],
            ['name' => 'フェラーリ',       'name_en' => 'Ferrari',      'country' => 'イタリア'],
            ['name' => 'ランボルギーニ',    'name_en' => 'Lamborghini',  'country' => 'イタリア'],
        ];

        foreach ($makers as $maker) {
            Maker::firstOrCreate(['name_en' => $maker['name_en']], $maker);
        }
    }
}
