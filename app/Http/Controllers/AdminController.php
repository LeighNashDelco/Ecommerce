<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class AdminController extends Controller
{
    public function getAdmins()
    {
        $admins = User::where('role_id', 1)
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
    
        return response()->json($admins);
    }
}
