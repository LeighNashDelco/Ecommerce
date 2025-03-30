<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Role
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Assuming role_id 1 is admin, 2 is customer, etc.
        $isAdmin = $user->role_id === 1; // Adjust based on your roles table

        if ($role === 'admin' && !$isAdmin) {
            return response()->json(['error' => 'Unauthorized: Admin access required'], 403);
        }

        return $next($request);
    }
}