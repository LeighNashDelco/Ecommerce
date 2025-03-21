<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // Existing store method (unchanged)
    public function store(Request $request) { /* ... */ }

    // Existing index method
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

    // New show method
    public function show($id)
    {
        try {
            $profile = Profile::with(['user', 'genderRelation'])->findOrFail($id);
            return response()->json($profile);
        } catch (\Exception $e) {
            \Log::error('Error fetching profile ID ' . $id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch profile: ' . $e->getMessage()], 500);
        }
    }
}