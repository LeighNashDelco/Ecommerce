<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MouseCategorySeeder extends Seeder
{
    public function run()
    {
        // Insert categories into the 'categories' table
        DB::table('categories')->insert([
            ['category_name' => 'Gaming Mouse'],
            ['category_name' => 'Wireless Mouse'],
            ['category_name' => 'Office Mouse'],
        ]);
    }
}
