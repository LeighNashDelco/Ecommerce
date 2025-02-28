<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class RolesTableController extends Controller
{
    public function getRolesList()
    {
        try {
            $roles = Role::where('archived', false)
                ->select('id', 'role_name', 'created_at', 'updated_at', 'archived')
                ->get();
            Log::info('Fetched active roles', ['count' => $roles->count()]);
            return response()->json($roles);
        } catch (\Exception $e) {
            Log::error('Error in getRolesList: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT id, role_name, created_at, updated_at, archived FROM roles WHERE archived = 0'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function getArchivedRolesList()
    {
        try {
            $roles = Role::where('archived', true)
                ->select('id', 'role_name', 'created_at', 'updated_at', 'archived')
                ->get();
            Log::info('Fetched archived roles', ['count' => $roles->count()]);
            return response()->json($roles);
        } catch (\Exception $e) {
            Log::error('Error in getArchivedRolesList: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT id, role_name, created_at, updated_at, archived FROM roles WHERE archived = 1'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function archive(Request $request, $id)
    {
        try {
            $role = Role::findOrFail($id);
            $role->archived = $request->input('archived', false);
            $role->save();
            Log::info('Role archived status updated', ['role_id' => $id, 'archived' => $role->archived]);
            return response()->json($role);
        } catch (\Exception $e) {
            Log::error('Error in archive role: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'role_name' => 'required|string|max:255|unique:roles,role_name',
            ]);

            $role = Role::create([
                'role_name' => $validatedData['role_name'],
                'archived' => false,
            ]);

            Log::info('Role created', ['role_id' => $role->id, 'role_name' => $role->role_name]);
            return response()->json(['role' => $role], 201);
        } catch (\Exception $e) {
            Log::error('Error in store role: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}