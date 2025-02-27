<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\{
    RegisterController,
    LoginController,
    ProfileController,
    RolesController,
    GenderController,
    AdminDashboardController,
    BrandController,
    CategoryController,
    ProductController,
    SellerController,
    AdminController,
    RolesTableController,
    UserListController,
    CustomerListController
};
use App\Models\Profile;

# ==============================
# AUTHENTICATION ROUTES (Passport)
# ==============================
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/register', [RegisterController::class, 'register']);

# Protected Logout Route
Route::middleware('auth:api')->post('/logout', [LoginController::class, 'logout']);

# Get Authenticated User
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

# ==============================
# PUBLIC ROUTES
# ==============================

# Fetch Roles & Genders for Registration
Route::get('/roles', [RolesController::class, 'index']);
Route::get('/genders', [GenderController::class, 'index']);

# Fetch Categories & Brands
Route::get('/brands', [BrandController::class, 'getBrands']);
Route::get('/categories', [CategoryController::class, 'getCategories']);

# Fetch Products (Public)
Route::get('/products', [ProductController::class, 'getProducts']);

# Fetch Users, Customers, Sellers, and Admins
Route::get('/getUserList', [UserListController::class, 'getUserList']);
Route::get('/customers', [CustomerListController::class, 'getCustomer']);
Route::get('/sellers', [SellerController::class, 'getSellers']);
Route::get('/admins', [AdminController::class, 'getAdmins']);

# Fetch Roles
Route::get('/roleslist', [RolesTableController::class, 'getRolesList']);

# Fetch User Profile by User ID
Route::get('/profiles/user/{userId}', function ($userId) {
    return Profile::where('user_id', $userId)->first();
});


# ==============================
# PROTECTED ROUTES (Require Authentication)
# ==============================
Route::middleware('auth:api')->group(function () {
    # Profile Management
    Route::post('/profiles', [ProfileController::class, 'store']);

    # Product Management
    Route::post('/products', [ProductController::class, 'store']);

    # Admin Dashboard Statistics
    Route::get('/dashboard/totals', [AdminDashboardController::class, 'getTotalCounts']);
    Route::get('/dashboard/orders', [AdminDashboardController::class, 'getTodayOrders']);
});
