<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class CustomerListController extends Controller
{
    public function getCustomers()
    {
        try {
            $customers = User::where('role_id', 2)
                ->where('users.archived', false) // Specify users.archived
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
            
            Log::info('Fetched active customers', ['count' => $customers->count()]);
            return response()->json($customers);
        } catch (\Exception $e) {
            Log::error('Error in getCustomers: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT users.id, users.username, users.email, roles.role_name, users.created_at, users.updated_at, users.archived FROM users JOIN roles ON users.role_id = roles.id WHERE role_id = 2 AND users.archived = 0'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function getArchivedCustomers()
    {
        try {
            $customers = User::where('role_id', 2)
                ->where('users.archived', true) // Specify users.archived
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
            
            Log::info('Fetched archived customers', ['count' => $customers->count()]);
            return response()->json($customers);
        } catch (\Exception $e) {
            Log::error('Error in getArchivedCustomers: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'query' => 'SELECT users.id, users.username, users.email, roles.role_name, users.created_at, users.updated_at, users.archived FROM users JOIN roles ON users.role_id = roles.id WHERE role_id = 2 AND users.archived = 1'
            ]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function archive(Request $request, $id)
    {
        try {
            $customer = User::where('role_id', 2)->findOrFail($id);
            $customer->archived = $request->input('archived', false);
            $customer->save();
            
            Log::info('Customer archived status updated', ['user_id' => $id, 'archived' => $customer->archived]);
            return response()->json($customer);
        } catch (\Exception $e) {
            Log::error('Error in archive customer: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }
}