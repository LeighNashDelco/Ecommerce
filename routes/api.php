<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SellerController;

# AUTHENTICATION ROUTES (Passport)
Route::post('/login', [LoginController::class, 'login'])->name('login');
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
Route::get('/genders', [GenderController::class, 'index']);

# FETCH FOR CATEGORIES AND BRAND
Route::get('/brands', [BrandController::class, 'getBrands']);
Route::get('/categories', [CategoryController::class, 'getCategories']);

# STATISTICS
Route::get('/dashboard/totals', [AdminDashboardController::class, 'getTotalCounts']);
Route::get('/dashboard/orders', [AdminDashboardController::class, 'getTodayOrders']);

# ADMIN PRODUCTS FUNCTION
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products', [ProductController::class, 'getProducts']);


# GET SELLERS
Route::get('/sellers', [SellerController::class, 'getSellers']);