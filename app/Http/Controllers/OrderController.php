<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function store(Request $request)
    {
        $request->headers->set('Accept', 'application/json');

        try {
            $request->validate([
                'profile_id' => 'required|exists:profiles,id',
                'shipping_method' => 'required|in:standard,priority',
                'items' => 'required|array',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'payment_method' => 'required|in:credit_card,paypal,cash_on_delivery',
            ]);

            $result = Order::createOrder($request->all());

            return response()->json([
                'message' => $result['message'],
                'total_amount' => $result['total_amount'],
                'estimated_delivery_date' => $result['estimated_delivery_date'],
                'payment_method' => $result['payment_method'],
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Order creation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);
            return response()->json(['error' => 'Failed to place order: ' . $e->getMessage()], 500);
        }
    }

    public function getUserOrders(Request $request)
    {
        \Log::info('getUserOrders called', [
            'user' => Auth::user(),
            'token' => $request->bearerToken(),
        ]);
        try {
            $profileId = Auth::user()->profile->id;
            
            $orders = Order::with(['product', 'status'])
                ->where('profile_id', $profileId)
                ->get()
                ->map(function ($order) {
                    \Log::info('Processing order', [
                        'order_id' => $order->id,
                        'product_id' => $order->product_id,
                        'product' => $order->product ? $order->product->toArray() : null,
                    ]);

                    return [
                        'id' => $order->id,
                        'profile_id' => $order->profile_id,
                        'order_date' => $order->order_date->toDateString(),
                        'total_amount' => number_format($order->total_amount, 2) . ' USD',
                        'status_name' => $order->status->name ?? 'Pending',
                        'status_id' => $order->status_id,
                        'order_number' => '#' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                        'shipping_address' => $order->shipping_address ?? 'Not specified',
                        'ship_to' => $order->profile->name ?? 'Customer',
                        'estimated_delivery_date' => $order->estimated_delivery_date?->toDateString(),
                        'product_id' => $order->product_id,
                        'product_name' => $order->product ? $order->product->product_name : 'Unknown Product',
                        'product_img' => $order->product ? $order->product->product_img : '/default-image.jpg',
                        'quantity' => $order->quantity,
                    ];
                });

            \Log::info('Orders fetched', ['orders' => $orders->toArray()]);
            return response()->json($orders, 200);
        } catch (\Exception $e) {
            \Log::error('Order fetch error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    public function cancelOrder(Request $request, $orderId)
    {
        $request->headers->set('Accept', 'application/json');
    
        try {
            $user = Auth::user();
            $profileId = $user->profile->id;
    
            \Log::info('Cancel order attempt', [
                'order_id' => $orderId,
                'profile_id' => $profileId,
                'user_id' => $user->id
            ]);
    
            $orderId = (int) $orderId;
            $order = Order::where('id', $orderId)
                ->where('profile_id', $profileId)
                ->first();
    
            if (!$order) {
                $userOrders = Order::where('profile_id', $profileId)
                    ->get(['id', 'profile_id', 'status_id'])
                    ->toArray();
                \Log::warning('Order lookup failed', [
                    'requested_order_id' => $orderId,
                    'user_profile_id' => $profileId,
                    'available_orders' => $userOrders
                ]);
                return response()->json([
                    'error' => 'Order not found',
                    'debug' => [
                        'requested_order_id' => $orderId,
                        'user_profile_id' => $profileId,
                        'your_orders' => $userOrders
                    ]
                ], 404);
            }
    
            $order->status_id = 5;
            $order->save();
    
            DB::table('order_histories')->insert([
                'order_id' => $order->id,
                'status_id' => 5,
                'updated_at' => now(),
            ]);
    
            \Log::info('Order successfully cancelled', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'new_status_id' => $order->status_id
            ]);
    
            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'order' => [
                    'id' => $order->id,
                    'status_id' => $order->status_id
                ]
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Order cancellation error', [
                'order_id' => $orderId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }
}