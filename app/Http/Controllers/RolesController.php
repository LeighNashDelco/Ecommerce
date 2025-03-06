<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Support\Facades\Log;

class RolesController extends Controller
{
    /**
     * Get roles where id is only 2 or 3.
     */
    public function getSpecificRoles()
    {
        try {
            $specificRoles = Role::whereIn('id', [2, 3])->get();

            Log::info('Fetched specific roles', ['count' => $specificRoles->count()]);

            return response()->json($specificRoles);
        } catch (\Exception $e) {
            Log::error('Error fetching specific roles: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Get all roles (id and role_name).
     */
    public function getAllRoles()
    {
        try {
            $allRoles = Role::select('id', 'role_name')->get();

            Log::info('Fetched all roles', ['count' => $allRoles->count()]);

            return response()->json($allRoles);
        } catch (\Exception $e) {
            Log::error('Error fetching all roles: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    public function ActiveRoles()
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
