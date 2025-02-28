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
Route::middleware('auth:api')->post('/logout', [LoginController::class, 'logout']);
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

# ==============================
# PUBLIC ROUTES
# ==============================
Route::get('/roles', [RolesController::class, 'index']);
Route::get('/genders', [GenderController::class, 'index']);
Route::get('/brands', [BrandController::class, 'getBrands']);
Route::get('/categories', [CategoryController::class, 'getCategories']);
Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('/sellers', [SellerController::class, 'getSellers']);
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
    Route::patch('/products/{id}/archive', [ProductController::class, 'archive']);
    Route::patch('/products/{id}', [ProductController::class, 'update']);

    # Admin Management
    Route::get('/admins', [AdminController::class, 'getAdmins']);
    Route::get('/admins/archived', [AdminController::class, 'getArchivedAdmins']);
    Route::patch('/admins/{id}/archive', [AdminController::class, 'archive']);

    # Customer Management
    Route::get('/customers', [CustomerListController::class, 'getCustomers']);
    Route::get('/customers/archived', [CustomerListController::class, 'getArchivedCustomers']);
    Route::patch('/customers/{id}/archive', [CustomerListController::class, 'archive']);

    # User Management
    Route::get('/users', [UserListController::class, 'getUsers']);
    Route::get('/users/archived', [UserListController::class, 'getArchivedUsers']);
    Route::patch('/users/{id}/archive', [UserListController::class, 'archive']);

    # Roles Management
    Route::get('/roleslist', [RolesTableController::class, 'getRolesList']); // Existing
    Route::get('/roleslist/archived', [RolesTableController::class, 'getArchivedRolesList']); // New
    Route::patch('/roleslist/{id}/archive', [RolesTableController::class, 'archive']); // New
    Route::post('/roleslist', [RolesTableController::class, 'store']); // New

    # Admin Dashboard Statistics
    Route::get('/dashboard/totals', [AdminDashboardController::class, 'getTotalCounts']);
    Route::get('/dashboard/orders', [AdminDashboardController::class, 'getTodayOrders']);
});