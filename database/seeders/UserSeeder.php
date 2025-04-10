<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'id' => 1,
            'username' => 'jeff.ogabang',
            'email' => 'jeffogabang7@gmail.com',
            'password' => Hash::make('Jeffogabang123'),
            'role_id' => 2,
            'created_at' => '2025-04-10 06:33:36',
            'updated_at' => '2025-04-10 06:33:36',
            'archived' => 0
        ]);

        User::create([
            'id' => 2,
            'username' => 'leigh.delco',
            'email' => 'leighnash@gmail.com',
            'password' => Hash::make('Leigh123'),
            'role_id' => 1,
            'created_at' => '2025-04-10 06:33:53',
            'updated_at' => '2025-04-10 06:33:53',
            'archived' => 0
        ]);
    }
}