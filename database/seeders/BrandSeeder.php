<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks to allow deletion
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Delete existing records without truncating the table
        DB::table('brands')->delete();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insert brand data
        DB::table('brands')->insert([
            [
                'id' => 1,
                'brand_name' => 'Razer',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'brand_name' => 'Logitech',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'brand_name' => 'SteelSeries',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'brand_name' => 'Corsair',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'brand_name' => 'HyperX',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}