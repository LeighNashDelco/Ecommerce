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
                'id' => 1,
                'profile_id' => 2,
                'brand_id' => 3,
                'category_id' => 1,
                'product_name' => 'Razer Viper V3 Pro',
                'price' => 1099.00,
                'quantity' => 4,
                'sold' => 0,
                'description' => 'Razer Viper V3 Pro - ultra lightweight',
                'product_img' => 'images/products/RazerViperV3Pro.jpg',
            ],
            [
                'id' => 2,
                'profile_id' => 1,
                'brand_id' => 1,
                'category_id' => 1,
                'product_name' => 'Attack Shark X11',
                'price' => 349.99,
                'quantity' => 18,
                'sold' => 2,
                'description' => 'Attack Shark X11 - High DPI mouse',
                'product_img' => 'images/products/AttackSharkX11.jpg',
            ],
            [
                'id' => 3,
                'profile_id' => 2,
                'brand_id' => 2,
                'category_id' => 1,
                'product_name' => 'Logitech G Pro',
                'price' => 699.99,
                'quantity' => 12,
                'sold' => 6,
                'description' => 'Logitech G Pro gaming mouse',
                'product_img' => 'images/products/LogitechGPro.jpg',
            ],
            [
                'id' => 4,
                'profile_id' => 2,
                'brand_id' => 2,
                'category_id' => 1,
                'product_name' => 'Logitech G Pro X',
                'price' => 849.00,
                'quantity' => 9,
                'sold' => 1,
                'description' => 'Logitech G Pro X for pro gamers',
                'product_img' => 'images/products/LogitechGProX.jpg',
            ],
            [
                'id' => 5,
                'profile_id' => 1,
                'brand_id' => 2,
                'category_id' => 1,
                'product_name' => 'Logitech M100',
                'price' => 250.00,
                'quantity' => 30,
                'sold' => 10,
                'description' => 'Affordable Logitech M100 mouse',
                'product_img' => 'images/products/LogitechM100.jpg',
            ],
            [
                'id' => 6,
                'profile_id' => 1,
                'brand_id' => 3,
                'category_id' => 1,
                'product_name' => 'Razer Cobra',
                'price' => 799.00,
                'quantity' => 10,
                'sold' => 3,
                'description' => 'Razer Cobra RGB mouse',
                'product_img' => 'images/products/RazerCobra.jpg',
            ],
            [
                'id' => 7,
                'profile_id' => 2,
                'brand_id' => 3,
                'category_id' => 1,
                'product_name' => 'Razer DeathAdder',
                'price' => 899.00,
                'quantity' => 8,
                'sold' => 4,
                'description' => 'Legendary Razer DeathAdder mouse',
                'product_img' => 'images/products/RazerDeathAdder.jpg',
            ],
            [
                'id' => 8,
                'profile_id' => 1,
                'brand_id' => 3,
                'category_id' => 1,
                'product_name' => 'Razer Pro Click',
                'price' => 999.99,
                'quantity' => 5,
                'sold' => 1,
                'description' => 'Premium Razer Pro Click mouse',
                'product_img' => 'images/products/RazerProClick.jpg',
            ],
            [
                'id' => 9,
                'profile_id' => 1,
                'brand_id' => 1,
                'category_id' => 1,
                'product_name' => 'Attack Shark X3',
                'price' => 299.99,
                'quantity' => 20,
                'sold' => 5,
                'description' => 'Precision gaming mouse Attack Shark X3',
                'product_img' => 'images/products/AttackSharkX3.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create(array_merge($product, [
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
