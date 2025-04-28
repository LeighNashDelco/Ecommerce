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
    ReviewController,
    NotificationController,
    ShopController,
    CartController,
    OrderController,
    TrackController,
    ChatController
};
use App\Models\Profile;

# ==============================
# AUTHENTICATION ROUTES (Passport)
#==============================
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/forgot-password', [LoginController::class, 'forgotPassword']);
Route::post('/reset-password', [LoginController::class, 'resetPassword']);
Route::post('/register', [RegisterController::class, 'register']);
Route::middleware('auth:api')->post('/logout', [LoginController::class, 'logout']);
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:api')->get('/user-profile', [UserController::class, 'getUserProfile']);
Route::middleware('auth:api')->get('/profiles', [ProfileController::class, 'index']);

# ==============================
# PUBLIC ROUTES
# ==============================
Route::get('/roles', [RolesController::class, 'getAllRoles']);
Route::get('/roles/specific', [RolesController::class, 'getSpecificRoles']);
Route::get('/roles/activeroles', [RolesController::class, 'ActiveRoles']);
Route::get('/genders', [GenderController::class, 'index']);
Route::get('/brands', [BrandController::class, 'getBrands']);
Route::get('/categories/active', [CategoryController::class, 'getActiveCategories']);
Route::get('/categories/archived', [CategoryController::class, 'getArchivedCategories']);
Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('/sellers', [SellerController::class, 'getSellers']);
Route::get('/profiles/user/{userId}', function ($userId) {
    return Profile::where('user_id', $userId)->first();
});
Route::get('/shop-products', [ShopController::class, 'getActiveProducts']);
Route::get('/shop-products/{id}', [ProductController::class, 'show']);
Route::get('/reviews/product/{productId}', [ReviewController::class, 'getByProduct']);
Route::get('/reviews/order/{orderId}', [ReviewController::class, 'getByOrder']);

# ==============================
# PROTECTED ROUTES (Require Authentication)
# ==============================
Route::middleware('auth:api')->group(function () {
    # Profile Management
    Route::post('/profiles', [ProfileController::class, 'store']);
    Route::get('/user-profile', [UserController::class, 'getUserProfile']);
    Route::post('/update-profile', [UserController::class, 'updateUserProfile']);
    Route::get('/profiles/{id}', [ProfileController::class, 'show']);

    # Product Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::patch('/products/{id}/archive', [ProductController::class, 'archive']);
    Route::patch('/products/{id}', [ProductController::class, 'update']);
    Route::post('/products/{id}/image', [ProductController::class, 'storeImage']);

    # Order Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/user', [OrderController::class, 'getUserOrders']);
    Route::post('/orders/{orderId}/cancel', [OrderController::class, 'cancelOrder']);
    Route::patch('/orders/{orderId}/update-status', [OrderController::class, 'updateStatus'])->middleware('auth:api');
    Route::post('/orders/{orderId}/complete', [OrderController::class, 'completeOrder']);
    Route::post('/orders/{orderId}/archive', [OrderController::class, 'archiveOrder'])->middleware('auth:api');
    Route::post('/orders/{orderId}/restore', [OrderController::class, 'restoreOrder'])->middleware('auth:api');
    
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
    Route::get('/users/{id}', [UserListController::class, 'getUser']);

    # Roles Management
    Route::get('/roleslist', [RolesTableController::class, 'getRolesList']);
    Route::get('/roleslist/archived', [RolesTableController::class, 'getArchivedRolesList']);
    Route::patch('/roleslist/{id}/archive', [RolesTableController::class, 'archive']);
    Route::post('/roleslist', [RolesTableController::class, 'store']);
    Route::patch('/roleslist/{id}', [RolesTableController::class, 'update']);

    # Admin Dashboard Statistics
    Route::get('/dashboard/totals', [AdminDashboardController::class, 'getTotalCounts']);
    Route::get('/dashboard/orders', [AdminDashboardController::class, 'getTodayOrders']);

    # Status and Category Management with Custom Unauthenticated Response
    Route::middleware(['auth:api'])->group(function () {
        Route::get('/statuses', function (Request $request) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->getActiveStatuses();
        });
        Route::get('/statuses/archived', function (Request $request) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->getArchivedStatuses();
        });
        Route::post('/statuses', function (Request $request) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->storeStatus($request);
        });
        Route::patch('/statuses/{id}/archive', function (Request $request, $id) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->archiveStatus($id);
        });
        Route::patch('/statuses/{id}', function (Request $request, $id) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->updateStatus($request, $id);
        });

        Route::get('/categories', function (Request $request) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->getActiveCategories();
        });
        Route::get('/categories/archived', function (Request $request) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->getArchivedCategories();
        });
        Route::post('/categories', function (Request $request) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->storeCategory($request);
        });
        Route::patch('/categories/{id}/archive', function (Request $request, $id) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->archiveCategory($id);
        });
        Route::patch('/categories/{id}', function (Request $request, $id) {
            if (!auth()->guard('api')->check()) {
                return response()->json(['message' => 'Please login first'], 401);
            }
            return app(StatusAndCategoryController::class)->updateCategory($request, $id);
        });
    });

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

    # Chat Management
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::get('/chat/customer', [ChatController::class, 'getCustomerMessages']);
    Route::get('/chat/admin', [ChatController::class, 'getAllMessages']);
    Route::post('/chat/reply', [ChatController::class, 'replyMessage']);
    Route::delete('/chat/message/{id}', [ChatController::class, 'deleteMessage']);

    # Review Management
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/archived', [ReviewController::class, 'archived']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::patch('/reviews/{id}/archive', [ReviewController::class, 'archive']);
    Route::match(['patch', 'put'], '/reviews/{id}', [ReviewController::class, 'update']);

    # Notification Management
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::get('/notifications/archived', [NotificationController::class, 'archived']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{id}/archive', [NotificationController::class, 'archive']);
    Route::patch('/notifications/{id}', [NotificationController::class, 'update']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'delete']);

    # FAQ Category Management
    Route::get('/faq_categories', [FaqCategoryController::class, 'index']);

    # Change Password
    Route::post('/change-password', [ChangePasswordAdminController::class, 'changePassword']);

    # Track Orders
    Route::get('/orders/track/{orderId}', [TrackController::class, 'trackOrder']);


    # Cart Management
    Route::get('/cart/{profileId}', [CartController::class, 'getCart']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::put('/cart/update', [CartController::class, 'updateCart']);
    Route::delete('/cart/remove', [CartController::class, 'removeFromCart']);
    Route::delete('/cart/clear/{profileId}', [CartController::class, 'clearCart']);
    Route::get('/cart/count', [CartController::class, 'getCartCount']);
});