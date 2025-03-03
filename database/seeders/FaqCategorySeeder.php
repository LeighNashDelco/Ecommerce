<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FaqCategory;

class FaqCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'General'],
            ['name' => 'Billing'],
            ['name' => 'Technical'],
        ];

        foreach ($categories as $category) {
            FaqCategory::create($category);
        }
    }
}