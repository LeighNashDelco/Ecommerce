<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Profile;
use App\Models\Status;
use Carbon\Carbon; // ✅ Correct import
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function getTotalCounts()
    {
        $totalAdmins = User::where('role_id', 1)->count(); // Admins
        $totalCustomers = User::where('role_id', 2)->count(); // Customers
        $totalSellers = User::where('role_id', 3)->count(); // Sellers
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalEarnings = Order::sum('total_amount'); // ✅ Correct column name
        $totalProductSales = OrderItem::sum('quantity');

        return response()->json([
            'total_customers' => $totalCustomers,
            'total_sellers' => $totalSellers,
            'total_admins' => $totalAdmins,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'total_earnings' => $totalEarnings,
            'total_product_sales' => $totalProductSales
        ]);
    }
    public function getTodayOrders(): JsonResponse
    {
        $todayOrders = Order::with(['profile', 'product', 'status'])
            ->whereDate('created_at', Carbon::today())
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => optional($order->profile)->first_name . '.' . optional($order->profile)->last_name,
                    'product' => optional($order->product)->product_name ?? 'N/A', // ✅ Fixed: Use product_name
                    'order_date' => Carbon::parse($order->order_date)->format('Y-m-d H:i:s'),
                    'quantity' => $order->quantity,
                    'total_amount' => number_format($order->total_amount, 2),
                    'status' => optional($order->status)->name ?? 'Pending',
                ];
            });
    
        return response()->json($todayOrders);
    }
    
}    
