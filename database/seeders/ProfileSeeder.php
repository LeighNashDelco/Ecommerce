<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('profiles')->insert([
            [
                'id' => 1,
                'user_id' => 1, // Links to jeff.ogabang from UserSeeder
                'first_name' => 'Jeff',
                'middlename' => null,
                'last_name' => 'Ogabang',
                'gender' => 'Male', // Assuming GenderSeeder has 'Male'
                'suffix' => null,
                'contact_number' => '123-456-7890',
                'street' => '123 Gaming Street',
                'city' => 'Tech City',
                'province' => 'Tech Province',
                'postal_code' => '12345',
                'country' => 'Philippines',
                'profile_img' => null,
                'created_at' => '2025-04-04 04:26:19',
                'updated_at' => '2025-04-04 04:26:19',
            ],
            [
                'id' => 2,
                'user_id' => 2, // Links to leigh.delco from UserSeeder
                'first_name' => 'Leigh',
                'middlename' => null,
                'last_name' => 'Delco',
                'gender' => 'Female', // Assuming GenderSeeder has 'Female'
                'suffix' => null,
                'contact_number' => '987-654-3210',
                'street' => '456 Mouse Lane',
                'city' => 'Gamer Town',
                'province' => 'Gamer Province',
                'postal_code' => '67890',
                'country' => 'Philippines',
                'profile_img' => null,
                'created_at' => '2025-04-04 05:07:27',
                'updated_at' => '2025-04-04 05:07:27',
            ],
        ]);
    }
}