<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            GenderSeeder::class,
            RoleSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            FaqCategorySeeder::class,
            StatusSeeder::class,
            UserSeeder::class,
            ProfileSeeder::class, 
            ProductSeeder::class,
        ]);
    }
}