<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function getAdmins()
    {
        try {
            $admins = User::where('role_id', 1)
                ->where('users.archived', false)
                ->join('roles', 'users.role_id', '=', 'roles.id')
                ->leftJoin('profiles', 'users.id', '=', 'profiles.user_id')
                ->select(
                    'users.id',
                    'users.username',
                    'users.email',
                    'roles.role_name',
                    'profiles.profile_img', // Added profile_img
                    'users.created_at',
                    'users.updated_at',
                    'users.archived'
                )
                ->get();
            
            Log::info('Fetched active admins', ['count' => $admins->count()]);
            return response()->json($admins);
        } catch (\Exception $e) {
            Log::error('Error in getAdmins: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT users.id, users.username, users.email, roles.role_name, profiles.profile_img, users.created_at, users.updated_at, users.archived FROM users JOIN roles ON users.role_id = roles.id LEFT JOIN profiles ON users.id = profiles.user_id WHERE role_id = 1 AND users.archived = 0'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function getArchivedAdmins()
    {
        try {
            $admins = User::where('role_id', 1)
                ->where('users.archived', true)
                ->join('roles', 'users.role_id', '=', 'roles.id')
                ->leftJoin('profiles', 'users.id', '=', 'profiles.user_id')
                ->select(
                    'users.id',
                    'users.username',
                    'users.email',
                    'roles.role_name',
                    'profiles.profile_img', // Added profile_img
                    'users.created_at',
                    'users.updated_at',
                    'users.archived'
                )
                ->get();
            
            Log::info('Fetched archived admins', ['count' => $admins->count()]);
            return response()->json($admins);
        } catch (\Exception $e) {
            Log::error('Error in getArchivedAdmins: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT users.id, users.username, users.email, roles.role_name, profiles.profile_img, users.created_at, users.updated_at, users.archived FROM users JOIN roles ON users.role_id = roles.id LEFT JOIN profiles ON users.id = profiles.user_id WHERE role_id = 1 AND users.archived = 1'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function archive(Request $request, $id)
    {
        try {
            $admin = User::where('role_id', 1)->findOrFail($id);
            $admin->archived = $request->input('archived', false);
            $admin->save();
            
            $admin->load('role');
            $adminData = [
                'id' => $admin->id,
                'username' => $admin->username,
                'email' => $admin->email,
                'role_name' => $admin->role->role_name,
                'profile_img' => $admin->profile ? $admin->profile->profile_img : null, // Include profile_img
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at,
                'archived' => $admin->archived,
            ];
            
            Log::info('Admin archived status updated', ['user_id' => $id, 'archived' => $admin->archived]);
            return response()->json($adminData);
        } catch (\Exception $e) {
            Log::error('Error in archive admin: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }
}