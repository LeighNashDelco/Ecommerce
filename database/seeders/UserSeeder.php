<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'id' => 1,
                'username' => 'jeff.ogabang',
                'email' => 'jeffogabang7@gmail.com',
                'password' => Hash::make('Jeffogabang2003'),
                'role_id' => 2,
                'created_at' => '2025-04-04 04:26:19',
                'updated_at' => '2025-04-04 04:26:19',
                'archived' => 0,
            ],
            [
                'id' => 2,
                'username' => 'leigh.delco',
                'email' => 'leighnash@gmail.com',
                'password' => Hash::make('Leigh123'),
                'role_id' => 1,
                'created_at' => '2025-04-04 05:07:27',
                'updated_at' => '2025-04-04 05:07:27',
                'archived' => 0,
            ],
        ]);
    }
}