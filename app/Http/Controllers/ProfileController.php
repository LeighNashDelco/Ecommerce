<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'gender_id' => 'required|exists:genders,id',
        ]);
    
        Profile::create($request->all());
    
        return response()->json(['message' => 'Profile created successfully'], 201);
    }
}    