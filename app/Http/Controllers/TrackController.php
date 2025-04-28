<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Profile;

class TrackController extends Controller
{
    public function trackOrder($orderId)
    {
        try {
            $user = auth('api')->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $profile = Profile::where('user_id', $user->id)->first();
            if (!$profile) {
                return response()->json(['message' => 'User profile not found'], 404);
            }

            $order = Order::with(['payments', 'product', 'status'])
                ->where('id', $orderId)
                ->where('profile_id', $profile->id)
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            $shippingAddress = "{$profile->street}, {$profile->city}, {$profile->province}, {$profile->postal_code}, {$profile->country}";
            $payment = $order->payments->first();
            $paymentMethod = $payment ? ($payment->payment_method === 'credit_card' ? 'Credit Card' : ucfirst($payment->payment_method)) : 'N/A';

            $statusDates = [
                'order_placed_date' => $order->order_date->toDateString(),
                'in_transit_date' => $order->status_id >= 2 ? $order->order_date->copy()->addDays(2)->toDateString() : null,
                'out_for_delivery_date' => $order->status_id >= 3 ? $order->order_date->copy()->addDays(3)->toDateString() : null,
                'delivered_date' => $order->status_id >= 4 ? $order->estimated_delivery_date->toDateString() : null,
            ];

            $response = [
                'id' => $order->id,
                'status' => $this->getStatusName($order->status_id),
                'total_amount' => number_format($order->total_amount, 2),
                'ship_to' => $profile->first_name . ' ' . $profile->last_name,
                'estimated_delivery_date' => $order->estimated_delivery_date->toDateString(),
                'order_placed_date' => $statusDates['order_placed_date'],
                'in_transit_date' => $statusDates['in_transit_date'],
                'out_for_delivery_date' => $statusDates['out_for_delivery_date'],
                'delivered_date' => $statusDates['delivered_date'],
                'product_name' => $order->product ? $order->product->product_name : 'Unknown Product',
                'product_img' => $order->product ? $order->product->product_img : null,
                'payment_method' => $paymentMethod,
                'shipping_address' => $shippingAddress,
            ];

            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    private function getStatusName($statusId)
    {
        $statusMap = [
            1 => 'Pending',
            2 => 'In Transit',
            3 => 'Shipped',
            4 => 'Delivered',
            5 => 'Completed',
            6 => 'Cancelled',
        ];
        return $statusMap[$statusId] ?? 'Pending';
    }
}