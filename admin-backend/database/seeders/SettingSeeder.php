<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            [
                'key' => 'print_pricing_black_white',
                'value' => '2.00',
                'type' => 'float',
                'description' => 'Base price per page for Black and White prints.',
            ],
            [
                'key' => 'print_pricing_color',
                'value' => '10.00',
                'type' => 'float',
                'description' => 'Base price per page for Color prints.',
            ],
            [
                'key' => 'binding_spiral',
                'value' => '50.00',
                'type' => 'float',
                'description' => 'Spiral binding flat charge.',
            ],
            [
                'key' => 'binding_staple',
                'value' => '10.00',
                'type' => 'float',
                'description' => 'Staple binding flat charge.',
            ],
            [
                'key' => 'free_delivery_threshold',
                'value' => '500.00',
                'type' => 'float',
                'description' => 'Minimum order total to receive free delivery.',
            ],
            [
                'key' => 'delivery_fee',
                'value' => '40.00',
                'type' => 'float',
                'description' => 'Delivery fee applied if threshold is not met.',
            ],
            [
                'key' => 'paper_size_a3_multiplier',
                'value' => '2.00',
                'type' => 'float',
                'description' => 'Cost multiplier factor for A3 size printing.',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'description' => $setting['description'],
                ]
            );
        }
    }
}
