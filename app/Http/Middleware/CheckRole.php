<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = $request->user();

        // Log the user and role check for debugging
        Log::info('Checking user role', [
            'user_id' => $user ? $user->id : null,
            'role_id' => $user ? $user->role_id : null,
            'role_name' => $user && $user->role ? $user->role->role_name : null,
            'required_role' => $role,
        ]);

        if (!$user || !$user->role || $user->role->role_name !== $role) {
            return response()->json(['error' => 'Unauthorized: Admin access required'], 403);
        }

        return $next($request);
    }
}