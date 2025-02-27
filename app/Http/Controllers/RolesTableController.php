<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;

class RolesTableController extends Controller
{
    public function getRolesList()
    {
        // Fetch all roles
        $roles = Role::all();
        return response()->json([
            'success' => true,
            'roles' => $roles
        ]);
    }
}
