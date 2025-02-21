<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\GenderController;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminDashboardController;


# AUTHENTICATION ROUTES
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

# PROFILE ROUTE
Route::middleware('auth:sanctum')->post('/profiles', [ProfileController::class, 'store']);

# FETCH FOR REGISTRATION ROLES AND GENDERS
Route::get('/roles', [RolesController::class, 'index']);
Route::get('/genders', [GenderController::class, 'getGenders']);

# STATISTICS
Route::get('/dashboard/totals', [AdminDashboardController::class, 'getTotalCounts']);
Route::get('/dashboard/orders', [AdminDashboardController::class, 'getTodayOrders']);