<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class GenderSeeder extends Seeder
{
    public function run()
    {
        // Clears the table and resets the auto-increment ID
        DB::table('genders')->truncate();

        DB::table('genders')->insert([
            ['name' => 'Male'],
            ['name' => 'Female'],
        ]);
    }
}
