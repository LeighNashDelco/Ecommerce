<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        try {
            Log::info('Fetching all orders for admin', [
                'user' => Auth::user() ? Auth::user()->toArray() : null,
                'token' => $request->bearerToken(),
            ]);

            $orders = Order::with(['profile.user', 'product', 'status'])->get();

            Log::info('Raw orders fetched', ['orders' => $orders->toArray()]);

            $formattedOrders = $orders->map(function ($order) {
                Log::debug('Processing order', [
                    'order_id' => $order->id,
                    'profile' => $order->profile ? $order->profile->toArray() : null,
                    'user' => $order->profile && $order->profile->user ? $order->profile->user->toArray() : null,
                    'product' => $order->product ? $order->product->toArray() : null,
                    'status' => $order->status ? $order->status->toArray() : null,
                ]);

                return [
                    'id' => $order->id,
                    'user' => [
                        'name' => $order->profile && $order->profile->user ? ($order->profile->user->name ?? 'N/A') : 'N/A',
                    ],
                    'product' => [
                        'name' => $order->product ? ($order->product->product_name ?? 'N/A') : 'N/A',
                    ],
                    'quantity' => $order->quantity,
                    'total_amount' => $order->total_amount,
                    'status_id' => $order->status_id,
                    'order_date' => $order->order_date ? $order->order_date->toDateString() : 'N/A',
                    'estimated_delivery_date' => $order->estimated_delivery_date ? $order->estimated_delivery_date->toDateString() : null,
                    'payment_method' => $order->payment_method ?? 'N/A',
                    'shipping_method' => $order->shipping_method ?? 'N/A',
                ];
            });

            Log::info('All orders fetched and formatted', ['count' => $formattedOrders->count()]);
            return response()->json($formattedOrders, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch all orders', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['error' => 'Failed to fetch orders: ' . $e->getMessage()], 500);
        }
    }

    // ... (rest of the methods remain unchanged: store, getUserOrders, cancelOrder)
    public function store(Request $request)
    {
        Log::info('Order request received', ['data' => $request->all()]);

        try {
            $validatedData = $request->validate([
                'profile_id' => 'required|integer|exists:profiles,id',
                'shipping_method' => 'required|string|in:standard,priority',
                'payment_method' => 'required|string|in:credit_card,cash_on_delivery,paypal',
                'total_amount' => 'required|numeric|min:0',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            $user = Auth::user();
            if (!$user->profile || $user->profile->id !== $validatedData['profile_id']) {
                return response()->json(['error' => 'Unauthorized: Profile does not belong to authenticated user'], 403);
            }

            $result = Order::createOrder($validatedData);

            if (isset($result['error'])) {
                return response()->json(['error' => $result['error']], $result['status'] ?? 500);
            }

            return response()->json($result, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Order creation failed in controller', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);
            return response()->json(['error' => 'Failed to create order: ' . $e->getMessage()], 500);
        }
    }

    public function getUserOrders(Request $request)
    {
        Log::info('getUserOrders called', [
            'user' => Auth::user(),
            'token' => $request->bearerToken(),
        ]);
        try {
            $user = Auth::user();
            if (!$user->profile) {
                return response()->json(['error' => 'No profile found for user'], 404);
            }
            $profileId = $user->profile->id;
            
            $orders = Order::with(['product', 'status'])
                ->where('profile_id', $profileId)
                ->get()
                ->map(function ($order) {
                    Log::info('Processing order', [
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
                        'estimated_delivery_date' => $order->estimated_delivery_date ? $order->estimated_delivery_date->toDateString() : null,
                        'product_id' => $order->product_id,
                        'product_name' => $order->product ? $order->product->product_name : 'Unknown Product',
                        'product_img' => $order->product ? $order->product->product_img : '/default-image.jpg',
                        'quantity' => $order->quantity,
                    ];
                });

            Log::info('Orders fetched', ['orders' => $orders->toArray()]);
            return response()->json($orders, 200);
        } catch (\Exception $e) {
            Log::error('Order fetch error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    public function cancelOrder(Request $request, $orderId)
    {
        try {
            $user = Auth::user();
            $profileId = $user->profile->id;

            Log::info('Cancel order attempt', [
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
                Log::warning('Order lookup failed', [
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

            Log::info('Order successfully cancelled', [
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
            Log::error('Order cancellation error', [
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