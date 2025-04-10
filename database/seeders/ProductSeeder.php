<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::create([
            'id' => 1,
            'profile_id' => 2,
            'brand_id' => 1,
            'category_id' => 1,
            'product_name' => 'Test',
            'price' => 300.00,
            'quantity' => 29,
            'sold' => 1,
            'description' => 'Test',
            'product_img' => '',
            'archived' => 0,
            'created_at' => '2025-04-10 06:35:29',
            'updated_at' => '2025-04-10 06:36:55'
        ]);

        Product::create([
            'id' => 2,
            'profile_id' => 1,
            'brand_id' => 2,
            'category_id' => 1,
            'product_name' => 'Wireless Mouse',
            'price' => 450.50,
            'quantity' => 15,
            'sold' => 3,
            'description' => 'Ergonomic wireless mouse with adjustable DPI',
            'product_img' => '',
            'archived' => 0,
            'created_at' => '2025-04-10 07:00:00',
            'updated_at' => '2025-04-10 07:00:00'
        ]);

        Product::create([
            'id' => 3,
            'profile_id' => 2,
            'brand_id' => 1,
            'category_id' => 2,
            'product_name' => 'LED Desk Lamp',
            'price' => 799.99,
            'quantity' => 10,
            'sold' => 0,
            'description' => 'Adjustable LED lamp with USB charging port',
            'product_img' => '',
            'archived' => 0,
            'created_at' => '2025-04-10 08:15:30',
            'updated_at' => '2025-04-10 08:15:30'
        ]);

        Product::create([
            'id' => 4,
            'profile_id' => 1,
            'brand_id' => 3,
            'category_id' => 3,
            'product_name' => 'USB-C Cable',
            'price' => 199.00,
            'quantity' => 50,
            'sold' => 5,
            'description' => 'Durable 2m USB-C charging cable',
            'product_img' => '',
            'archived' => 0,
            'created_at' => '2025-04-10 09:30:45',
            'updated_at' => '2025-04-10 09:30:45'
        ]);
    }
}