<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Laravel\Passport\HasApiTokens;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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

            if ($user->archived) {
                Auth::logout();
                return response()->json([
                    'error' => 'Your account is archived and cannot log in.'
                ], 403);
            }

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

    public function forgotPassword(Request $request)
{
    $request->validate(['email' => 'required|email']);

    try {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            Log::info('Password reset link sent', ['email' => $request->email]);
            return response()->json(['message' => 'Password reset link sent to your email.'], 200);
        } else {
            Log::warning('Failed to send reset link', ['email' => $request->email, 'status' => $status]);
            return response()->json(['message' => 'Unable to send reset link: ' . __($status)], 400);
        }
    } catch (\Exception $e) {
        Log::error('Error sending reset link', [
            'email' => $request->email,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
    }
}

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'token', 'password', 'password_confirmation'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
                $user->tokens()->delete(); // Revoke existing tokens
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            Log::info('Password reset successful', ['email' => $request->email]);
            return response()->json(['message' => 'Password has been reset successfully.'], 200);
        } else {
            Log::warning('Password reset failed', ['email' => $request->email, 'status' => $status]);
            return response()->json(['message' => 'Invalid token or email.'], 400);
        }
    }
}