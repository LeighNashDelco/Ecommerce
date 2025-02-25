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
                'gender' => 'required|integer|exists:genders,id', 
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
    
            // Generate a unique username
            $usernameBase = strtolower($validatedData['first_name'] . '.' . $validatedData['last_name']);
            $username = $usernameBase;
            $counter = 1;
    
            while (User::where('username', $username)->exists()) {
                $username = $usernameBase . $counter;
                $counter++;
            }
    
            // Create user
            $user = User::create([
                'username' => $username, 
                'email' => $validatedData['email'],
                'password' => $request->password,
                'role_id' => $validatedData['role_id'],
            ]);
    
            // Log user creation for debugging
            \Log::info('User created', ['user' => $user]);
    
            // Create profile
            Profile::create([
                'user_id' => $user->id,
                'first_name' => $validatedData['first_name'],
                'middlename' => $validatedData['middlename'] ?? null,
                'last_name' => $validatedData['last_name'],
                'gender' => $validatedData['gender'], // Store ID instead of name
                'suffix' => $validatedData['suffix'] ?? null,
            ]);
    
            DB::commit();
    
            return response()->json([
                'message' => 'User registered successfully!',
                'user' => $user, // Include user details in response
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Registration Error', ['error' => $e->getMessage()]);
            
            return response()->json([
                'error' => 'Registration failed, please try again.',
            ], 500);
        }
    }
    
}