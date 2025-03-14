<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // Existing store method (unchanged)
    public function store(Request $request) { /* ... */ }

    // New index method
    public function index()
    {
        try {
            $profiles = Profile::all()->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'user_id' => $profile->user_id,
                    'first_name' => $profile->first_name,
                    'last_name' => $profile->last_name,
                    'full_name' => $profile->first_name . ' ' . $profile->last_name,
                ];
            });
            return response()->json($profiles);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch profiles: ' . $e->getMessage()], 500);
        }
    }
}