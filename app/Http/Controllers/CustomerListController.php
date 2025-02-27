<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class CustomerListController extends Controller
{
    public function getCustomer()   
    {
        $customers = User::where('role_id', 2)
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.username', 
                'users.email', 
                'roles.role_name', 
                'users.created_at', 
                'users.updated_at'
            )
            ->get();
    
        return response()->json($customers);
    }
}
