<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = ['Buyer', 'Seller', 'Admin'];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['role_name' => $role], // Check if role exists
                ['created_at' => now(), 'updated_at' => now()] // Insert if not exists
            );
        }
    }
}
