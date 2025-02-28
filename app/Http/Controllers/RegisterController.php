<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Gender;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        DB::beginTransaction();
        try {
            \Log::info('Register request data:', $request->all());
    
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
    
            $gender = Gender::find($validatedData['gender']);
            if (!$gender) {
                return response()->json(['error' => 'Invalid gender selection'], 400);
            }
    
            $usernameBase = strtolower($validatedData['first_name'] . '.' . $validatedData['last_name']);
            $username = $usernameBase;
            $counter = 1;
    
            while (User::where('username', $username)->exists()) {
                $username = $usernameBase . $counter;
                $counter++;
            }
    
            $user = User::create([
                'username' => $username,
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role_id' => $validatedData['role_id'],
            ]);
    
            \Log::info('User created', ['user' => $user->toArray()]);
    
            Profile::create([
                'user_id' => $user->id,
                'first_name' => $validatedData['first_name'],
                'middlename' => $validatedData['middlename'] ?? null,
                'last_name' => $validatedData['last_name'],
                'gender' => $validatedData['gender'],
                'suffix' => $validatedData['suffix'] ?? null,
            ]);
    
            DB::commit();
    
            return response()->json([
                'message' => 'User registered successfully!',
                'user' => $user,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollback();
            \Log::error('Validation Error in register', ['errors' => $e->errors(), 'request' => $request->all()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Registration Error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}