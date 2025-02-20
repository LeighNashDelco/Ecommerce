<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GenderSeeder extends Seeder
{
    public function run()
    {
        DB::table('genders')->insert([
            ['id' => 1, 'gender_name' => 'Male'],
            ['id' => 2, 'gender_name' => 'Female'],
        ]);
    }
}
