<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class UserListController extends Controller
{
    public function getUserList()
    {
        $users = User::whereIn('role_id', [1, 2, 3])
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select('users.username', 'users.email', 'roles.role_name', 'users.created_at', 'users.updated_at')
            ->get();
    
        return response()->json(['users' => $users]);
    }
}