<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Gender;



class RegisterController extends Controller
{
    public function register(Request $request)
{
    DB::beginTransaction();
    try {
        // Validate input
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|integer|exists:genders,id', // Expecting gender_id
            'suffix' => 'nullable|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        // Fetch gender
        $gender = Gender::find($validatedData['gender']);

        if (!$gender) {
            return response()->json(['error' => 'Invalid gender selection'], 400);
        }

        // Create user
$user = User::create([
    'username' => strtolower($validatedData['first_name'] . '.' . $validatedData['last_name']), // ✅ Make sure it's included
    'email' => $validatedData['email'],
    'password' => Hash::make($validatedData['password']),
    'role_id' => $validatedData['role_id'],
]);


        // Debugging step: Check data before inserting profile
        \Log::info('User created', ['user' => $user]);

        // Create profile
        Profile::create([
            'user_id' => $user->id,
            'first_name' => $validatedData['first_name'],
            'middlename' => $validatedData['middlename'] ?? null,
            'last_name' => $validatedData['last_name'],
            'gender' => $gender->name,  // ✅ Match your genders table
            'suffix' => $validatedData['suffix'] ?? null,
        ]);

        DB::commit();

        return response()->json(['message' => 'User registered successfully!'], 201);
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json([
            'error' => 'Registration failed',
            'message' => $e->getMessage(),
            'trace' => $e->getTrace() // Debugging purposes
        ], 500);
    }
}
}