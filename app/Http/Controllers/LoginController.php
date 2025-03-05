<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Laravel\Passport\HasApiTokens;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
    
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            // Check if user is archived
            if (!$user->isActive()) {
                Auth::logout(); // Log out the user if archived
                return response()->json([
                    'error' => 'Your account is archived and cannot log in.'
                ], 403);
            }

            // Generate token for active user
            $token = $user->createToken('LaravelPassportToken')->accessToken;
    
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ], 200);
        } else {
            return response()->json([
                'error' => 'Invalid email or password.'
            ], 401);
        }
    }
}