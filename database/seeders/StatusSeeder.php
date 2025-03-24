<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    public function run()
    {
        DB::table('statuses')->insert([
            [
                'id' => 1,
                'status_name' => 'Pending',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'status_name' => 'In Transit',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'status_name' => 'Shipped',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 4,
                'status_name' => 'Delivered',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 5,
                'status_name' => 'Cancelled',
                'archived' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}