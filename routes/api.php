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
    CustomerListController,
    UserController,
    StatusAndCategoryController,
    HelpAndSupportController,
    FaqCategoryController,
    ChangePasswordAdminController,
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
Route::middleware('auth:api')->get('/user-profile', [UserController::class, 'getUserProfile']);

# ==============================
# PUBLIC ROUTES
# ==============================
Route::get('/roles', [RolesController::class, 'getAllRoles']);
Route::get('/roles/specific', [RolesController::class, 'getSpecificRoles']);
Route::get('/roles/activeroles', [RolesController::class, 'ActiveRoles']);
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
    Route::put('/update-profile', [UserController::class, 'updateUserProfile']);

    # Product Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::patch('/products/{id}/archive', [ProductController::class, 'archive']);
    Route::patch('/products/{id}', [ProductController::class, 'update']);
    Route::post('/products/{id}/image', [ProductController::class, 'storeImage']);

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
    Route::patch('/users/{id}', [UserListController::class, 'update']);
    Route::get('/users/{id}', [UserListController::class, 'getUser']); // Added this line

    # Roles Management
    Route::get('/roleslist', [RolesTableController::class, 'getRolesList']);
    Route::get('/roleslist/archived', [RolesTableController::class, 'getArchivedRolesList']);
    Route::patch('/roleslist/{id}/archive', [RolesTableController::class, 'archive']);
    Route::post('/roleslist', [RolesTableController::class, 'store']);
    Route::patch('/roleslist/{id}', [RolesTableController::class, 'update']);

    # Admin Dashboard Statistics
    Route::get('/dashboard/totals', [AdminDashboardController::class, 'getTotalCounts']);
    Route::get('/dashboard/orders', [AdminDashboardController::class, 'getTodayOrders']);

    # Status and Category Management
    Route::get('/statuses', [StatusAndCategoryController::class, 'getActiveStatuses']);
    Route::get('/statuses/archived', [StatusAndCategoryController::class, 'getArchivedStatuses']);
    Route::post('/statuses', [StatusAndCategoryController::class, 'storeStatus']);
    Route::patch('/statuses/{id}/archive', [StatusAndCategoryController::class, 'archiveStatus']);
    Route::patch('/statuses/{id}', [StatusAndCategoryController::class, 'updateStatus']);

    Route::get('/categories', [StatusAndCategoryController::class, 'getActiveCategories']);
    Route::get('/categories/archived', [StatusAndCategoryController::class, 'getArchivedCategories']);
    Route::post('/categories', [StatusAndCategoryController::class, 'storeCategory']);
    Route::patch('/categories/{id}/archive', [StatusAndCategoryController::class, 'archiveCategory']);
    Route::patch('/categories/{id}', [StatusAndCategoryController::class, 'updateCategory']);

    # Inventory Management
    Route::get('/inventory', [ProductController::class, 'getActiveInventory']);
    Route::get('/inventory/archived', [ProductController::class, 'getArchivedInventory']);
    Route::patch('/inventory/{id}/archive', [ProductController::class, 'archive']);

    # Brand Management
    Route::get('/brands/active', [BrandController::class, 'getActiveBrands']);
    Route::get('/brands/archived', [BrandController::class, 'getArchivedBrands']);
    Route::post('/brands', [BrandController::class, 'store']);
    Route::patch('/brands/{id}/archive', [BrandController::class, 'archive']);
    Route::patch('/brands/{id}', [BrandController::class, 'update']);

    # Help and Support Management
    Route::get('/helpandsupport', [HelpAndSupportController::class, 'getActiveFaqs']);
    Route::get('/helpandsupport/archived', [HelpAndSupportController::class, 'getArchivedFaqs']);
    Route::post('/helpandsupport', [HelpAndSupportController::class, 'store']);
    Route::patch('/helpandsupport/{id}/archive', [HelpAndSupportController::class, 'archive']);
    Route::patch('/helpandsupport/{id}', [HelpAndSupportController::class, 'update']);

    # FAQ Category Management
    Route::get('/faq_categories', [FaqCategoryController::class, 'index']);

    # Change Password
    Route::middleware('auth:api')->post('/change-password', [ChangePasswordAdminController::class, 'changePassword']);
});