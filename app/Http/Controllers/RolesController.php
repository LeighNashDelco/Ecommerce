<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Support\Facades\Log;

class RolesController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::where('archived', false)->get(); // Only active roles
            Log::info('Fetched active roles', ['count' => $roles->count()]);
            return response()->json($roles);
        } catch (\Exception $e) {
            Log::error('Error fetching roles: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}