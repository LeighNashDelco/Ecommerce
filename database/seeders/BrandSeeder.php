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
            ['brand_name' => 'Attack Shark X3'],
            ['brand_name' => 'Logitech'],
            ['brand_name' => 'Razer'],
        ]);
    }
}
