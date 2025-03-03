<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['category_name' => 'Wireless'],
            ['category_name' => 'Gaming'],
            ['category_name' => 'Office'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}