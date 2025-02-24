<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\GenderController;

# AUTHENTICATION ROUTES (Passport)
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:api'); // Fixed redundancy

# AUTHENTICATED USER INFO
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

# PROFILE ROUTE (Requires Authentication)
Route::post('/profiles', [ProfileController::class, 'store'])->middleware('auth:api');

# FETCH FOR REGISTRATION ROLES AND GENDERS
Route::get('/roles', [RolesController::class, 'index']);
Route::get('/genders', [GenderController::class, 'getGenders']);
