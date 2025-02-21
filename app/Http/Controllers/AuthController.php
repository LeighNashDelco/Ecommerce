<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Passport\Client;
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
            // Validate input with custom email error message
            $validatedData = $request->validate([
                'first_name' => 'required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'gender' => 'required|integer|exists:genders,id',
                'suffix' => 'nullable|string|max:50',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role_id' => 'required|integer|exists:roles,id',
            ], [
                'email.unique' => 'This email is already registered. Please use a different one.',
            ]);

            // Fetch gender name
            $gender = Gender::find($validatedData['gender']);

            if (!$gender) {
                return response()->json(['error' => 'Invalid gender selection'], 400);
            }

            // Create user
            $user = User::create([
                'username' => strtolower($validatedData['first_name'] . '.' . $validatedData['last_name']),
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role_id' => $validatedData['role_id'],
            ]);

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                'first_name' => $validatedData['first_name'],
                'middlename' => $validatedData['middlename'],
                'last_name' => $validatedData['last_name'],
                'gender' => $gender->gender_name,
                'suffix' => $validatedData['suffix'],
            ]);

            DB::commit();

            return response()->json(['message' => 'User registered successfully!'], 201);
        } catch (\Exception $e) {
            DB::rollback();

            if (isset($e->errorInfo[1]) && $e->errorInfo[1] == 1062) {
                return response()->json(['error' => 'This email is already registered. Please use a different one.'], 400);
            }

            return response()->json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
        }
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
    
        // Find user by email
        $user = User::where('email', $request->email)->first();
    
        // Check if user exists
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        // Debugging Log (Optional)
        \Log::info('Stored Hashed Password:', ['password' => $user->password]);
    
        // Check if password matches
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Login failed! Check your credentials.'], 401);
        }
    
        // Generate access token using Laravel Passport
        $token = $user->createToken('AuthToken')->accessToken;
    
        return response()->json([
            'message' => 'Login successful!',
            'user' => $user,
            'token' => $token,
        ]);
    }
}