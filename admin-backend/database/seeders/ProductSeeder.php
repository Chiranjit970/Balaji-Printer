<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'id' => 'prod-001',
                'name' => 'Premium Visiting Card',
                'description' => 'High quality matte finish visiting cards. Perfect for business and personal use. Printed on 350 GSM premium card stock with sharp, vibrant colors.',
                'short_description' => 'Matte Finish • 350 GSM',
                'price' => 249.00,
                'original_price' => 349.00,
                'currency' => 'INR',
                'category_id' => 'visiting-cards',
                'images' => [
                    'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600',
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
                ],
                'rating' => 4.6,
                'review_count' => 128,
                'features' => [
                    ['icon' => 'checkmark-circle-outline', 'label' => 'Matte Finish', 'description' => 'Premium look'],
                    ['icon' => 'layers-outline', 'label' => '350 GSM', 'description' => 'Thick & durable'],
                    ['icon' => 'color-palette-outline', 'label' => 'Full Color', 'description' => 'Vibrant printing'],
                ],
                'specifications' => [
                    'Paper Stock' => '350 GSM Art Card',
                    'Finish' => 'Matte Lamination',
                    'Size' => '90mm × 55mm',
                    'Quantity' => '100 cards',
                    'Printing' => 'Both sides',
                ],
                'in_stock' => true,
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'is_best_seller' => true,
                'tags' => ['business', 'premium', 'matte'],
            ],
            [
                'id' => 'prod-002',
                'name' => 'A4 Flyer',
                'description' => 'High quality glossy flyer for promotions and events. Vibrant print on glossy paper.',
                'short_description' => 'Glossy Finish • 170 GSM',
                'price' => 199.00,
                'original_price' => null,
                'currency' => 'INR',
                'category_id' => 'flyers',
                'images' => [
                    'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=600',
                ],
                'rating' => 4.7,
                'review_count' => 96,
                'features' => [
                    ['icon' => 'star-outline', 'label' => 'Glossy Finish', 'description' => 'Vibrant colors'],
                    ['icon' => 'layers-outline', 'label' => '170 GSM', 'description' => 'Standard weight'],
                    ['icon' => 'resize-outline', 'label' => 'A4 Size', 'description' => '210 × 297 mm'],
                ],
                'specifications' => [
                    'Paper' => '170 GSM Gloss Art',
                    'Finish' => 'Glossy',
                    'Size' => 'A4 (210 × 297 mm)',
                    'Printing' => 'Single side',
                ],
                'in_stock' => true,
                'stock_status' => 'in_stock',
                'is_featured' => true,
                'is_best_seller' => true,
                'tags' => ['flyer', 'promotion', 'glossy'],
            ],
            [
                'id' => 'prod-003',
                'name' => 'Roll-up Banner',
                'description' => 'Premium quality roll-up banner for exhibitions, shops, and events.',
                'short_description' => 'Premium quality banner',
                'price' => 699.00,
                'original_price' => null,
                'currency' => 'INR',
                'category_id' => 'banners',
                'images' => [
                    'https://images.unsplash.com/photo-1613235788016-8a67c4e03f11?w=600',
                ],
                'rating' => 4.5,
                'review_count' => 72,
                'features' => [
                    ['icon' => 'resize-outline', 'label' => 'Large Format', 'description' => '85 × 200 cm'],
                    ['icon' => 'construct-outline', 'label' => 'With Stand', 'description' => 'Easy setup'],
                    ['icon' => 'color-palette-outline', 'label' => 'Full Color', 'description' => 'Vivid print'],
                ],
                'specifications' => [
                    'Size' => '85cm × 200cm',
                    'Material' => 'Premium vinyl',
                    'Stand' => 'Aluminum roll-up',
                    'Carry bag' => 'Included',
                ],
                'in_stock' => true,
                'stock_status' => 'low_stock',
                'is_featured' => false,
                'is_best_seller' => true,
                'tags' => ['banner', 'exhibition', 'rollup'],
            ],
            [
                'id' => 'prod-004',
                'name' => 'Spiral Notebook',
                'description' => 'A5 spiral bound notebook with 80 ruled pages. Perfect for office and students.',
                'short_description' => 'A5, 80 pages',
                'price' => 129.00,
                'original_price' => null,
                'currency' => 'INR',
                'category_id' => 'stationery',
                'images' => [
                    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
                ],
                'rating' => 4.4,
                'review_count' => 58,
                'features' => [
                    ['icon' => 'book-outline', 'label' => '80 Pages', 'description' => 'Ruled paper'],
                    ['icon' => 'resize-outline', 'label' => 'A5 Size', 'description' => 'Compact & handy'],
                    ['icon' => 'git-commit-outline', 'label' => 'Spiral Bound', 'description' => 'Lay flat'],
                ],
                'specifications' => [
                    'Pages' => '80',
                    'Size' => 'A5 (148 × 210 mm)',
                    'Binding' => 'Spiral',
                    'Ruling' => 'Single line',
                ],
                'in_stock' => true,
                'stock_status' => 'in_stock',
                'is_featured' => false,
                'is_best_seller' => true,
                'tags' => ['notebook', 'stationery', 'spiral'],
            ],
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(
                ['id' => $prod['id']],
                [
                    'name' => $prod['name'],
                    'description' => $prod['description'],
                    'short_description' => $prod['short_description'],
                    'price' => $prod['price'],
                    'original_price' => $prod['original_price'],
                    'currency' => $prod['currency'],
                    'category_id' => $prod['category_id'],
                    'images' => $prod['images'],
                    'rating' => $prod['rating'],
                    'review_count' => $prod['review_count'],
                    'features' => $prod['features'],
                    'specifications' => $prod['specifications'],
                    'in_stock' => $prod['in_stock'],
                    'stock_status' => $prod['stock_status'],
                    'is_featured' => $prod['is_featured'],
                    'is_best_seller' => $prod['is_best_seller'],
                    'tags' => $prod['tags'],
                ]
            );
        }
    }
}
