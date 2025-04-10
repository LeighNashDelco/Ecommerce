<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;

class ProfileSeeder extends Seeder
{
    public function run()
    {
        Profile::create([
            'id' => 1,
            'user_id' => 1,
            'first_name' => 'Jeff',
            'middlename' => 'N/A',
            'last_name' => 'Ogabang',
            'gender' => 1,
            'suffix' => 'N/A',
            'contact_number' => '09656474358',
            'street' => 'J.C Aquino Avenue',
            'city' => 'Butuan City',
            'province' => 'Agusan Del Norte',
            'postal_code' => '8600',
            'country' => 'Philippines',
            'profile_img' => null,
            'created_at' => '2025-04-10 06:33:36',
            'updated_at' => '2025-04-10 06:36:40'
        ]);

        Profile::create([
            'id' => 2,
            'user_id' => 2,
            'first_name' => 'Leigh',
            'middlename' => null,
            'last_name' => 'Delco',
            'gender' => 1,
            'suffix' => null,
            'contact_number' => null,
            'street' => null,
            'city' => null,
            'province' => null,
            'postal_code' => null,
            'country' => null,
            'profile_img' => null,
            'created_at' => '2025-04-10 06:33:53',
            'updated_at' => '2025-04-10 06:33:53'
        ]);
    }
}