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

    public function logout(Request $request)
{
    $user = Auth::guard('api')->user(); // ✅ Use auth:api guard

    if ($user) { 
        $user->tokens->each(function ($token) {
            $token->revoke();
        });

        return response()->json([
            'message' => 'Successfully logged out'
        ], 200);
    }

    return response()->json([
        'error' => 'Unauthorized'
    ], 401);
}



}