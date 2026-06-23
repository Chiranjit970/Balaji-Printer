<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'id' => 'visiting-cards',
                'name' => 'Visiting Cards',
                'icon' => 'card-outline',
                'color' => '#EFF6FF',
            ],
            [
                'id' => 'banners',
                'name' => 'Banners',
                'icon' => 'megaphone-outline',
                'color' => '#F0FDF4',
            ],
            [
                'id' => 'flyers',
                'name' => 'Flyers',
                'icon' => 'document-text-outline',
                'color' => '#FFF7ED',
            ],
            [
                'id' => 'books',
                'name' => 'Books',
                'icon' => 'book-outline',
                'color' => '#FDF4FF',
            ],
            [
                'id' => 'stationery',
                'name' => 'Stationery',
                'icon' => 'pencil-outline',
                'color' => '#FFF7ED',
            ],
            [
                'id' => 'accessories',
                'name' => 'Accessories',
                'icon' => 'construct-outline',
                'color' => '#F0FDF4',
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['id' => $cat['id']],
                [
                    'name' => $cat['name'],
                    'icon' => $cat['icon'],
                    'color' => $cat['color'],
                ]
            );
        }
    }
}
