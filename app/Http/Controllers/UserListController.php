<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class UserListController extends Controller
{
    public function getUsers()
    {
        try {
            $users = User::where('users.archived', false) // Specify table
                ->join('roles', 'users.role_id', '=', 'roles.id')
                ->select(
                    'users.id',
                    'users.username',
                    'users.email',
                    'roles.role_name',
                    'users.created_at',
                    'users.updated_at',
                    'users.archived'
                )
                ->get();
            Log::info('Fetched active users', ['count' => $users->count()]);
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error in getUsers: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT users.id, users.username, users.email, roles.role_name, users.created_at, users.updated_at, users.archived FROM users JOIN roles ON users.role_id = roles.id WHERE users.archived = 0'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function getArchivedUsers()
    {
        try {
            $users = User::where('users.archived', true) // Specify table
                ->join('roles', 'users.role_id', '=', 'roles.id')
                ->select(
                    'users.id',
                    'users.username',
                    'users.email',
                    'roles.role_name',
                    'users.created_at',
                    'users.updated_at',
                    'users.archived'
                )
                ->get();
            Log::info('Fetched archived users', ['count' => $users->count()]);
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error in getArchivedUsers: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT users.id, users.username, users.email, roles.role_name, users.created_at, users.updated_at, users.archived FROM users JOIN roles ON users.role_id = roles.id WHERE users.archived = 1'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function archive(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->archived = $request->input('archived', false);
            $user->save();
            Log::info('User archived status updated', ['user_id' => $id, 'archived' => $user->archived]);
            return response()->json($user);
        } catch (\Exception $e) {
            Log::error('Error in archive user: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function getUserList()
    {
        try {
            $users = User::whereIn('role_id', [1, 2, 3])
                ->join('roles', 'users.role_id', '=', 'roles.id')
                ->select(
                    'users.id',
                    'users.username',
                    'users.email',
                    'roles.role_name',
                    'users.created_at',
                    'users.updated_at'
                )
                ->get();
            Log::info('Fetched user list', ['count' => $users->count()]);
            return response()->json(['users' => $users]);
        } catch (\Exception $e) {
            Log::error('Error in getUserList: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}