<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;

class SellerController extends Controller
{
    public function getSellers()
    {
        $sellers = User::where('role_id', 3)
            ->join('profiles', 'users.id', '=', 'profiles.user_id') // Join with profiles table
            ->select('users.id', 'users.username', 'profiles.id as profile_id') // Select needed fields
            ->get();

        return response()->json($sellers);
    }
}
