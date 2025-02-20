<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Profile;
use App\Models\Gender;
use Laravel\Passport\HasApiTokens;

class AuthController extends Controller
{
    // Register a new user
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

            // Fetch gender_name from genders table
            $gender = Gender::find($validatedData['gender']);

            if (!$gender) {
                return response()->json(['error' => 'Invalid gender selection'], 400);
            }

            // Create user
            $user = User::create([
                'username' => strtolower($validatedData['first_name'] . '.' . $validatedData['last_name']),
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']), // ✅ Correct

                'role_id' => $validatedData['role_id'],
            ]);

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                'first_name' => $validatedData['first_name'],
                'middlename' => $validatedData['middlename'],
                'last_name' => $validatedData['last_name'],
                'gender' => $gender->gender_name, // Store gender_name instead of gender_id
                'suffix' => $validatedData['suffix'],
            ]);

            DB::commit();

            return response()->json(['message' => 'User registered successfully!'], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
        }
    }
}
