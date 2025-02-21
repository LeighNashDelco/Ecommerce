<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderItem;
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
        $totalEarnings = Order::sum('total_price'); // ✅ Sum of total_price from Orders
        $totalProductSales = OrderItem::sum('quantity');
    
        return response()->json([
            'total_customers' => $totalCustomers,
            'total_sellers' => $totalSellers,
            'total_admins' => $totalAdmins,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'total_earnings' => $totalEarnings, // ✅ Now correct
            'total_product_sales' => $totalProductSales
        ]);
    }
    public function getTodayOrders(): JsonResponse
    {
        $todayOrders = Order::with(['user'])
            ->withSum('orderItems', 'quantity') // Ensure summing is from order_items
            ->whereDate('created_at', now()->toDateString()) 
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => $order->user ? $order->user->username : 'Unknown',
                    'date' => $order->created_at->format('Y-m-d H:i:s'),
                    'quantity' => (int) $order->order_items_sum_quantity, // Get summed quantity
                    'amount' => (float) $order->total_price, 
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                ];
            });
    
        return response()->json($todayOrders);
    }
    
}    