<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class Order extends Model
{
    protected $fillable = [
        'profile_id', 'product_id', 'order_date', 'quantity', 'total_amount',
        'status_id', 'estimated_delivery_date', 'payment_method', 'shipping_method',
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'estimated_delivery_date' => 'datetime',
    ];

    public function profile() { return $this->belongsTo(Profile::class); }
    public function product() { return $this->belongsTo(Product::class); }
    public function status() { return $this->belongsTo(Status::class, 'status_id'); }
    public function payments() { return $this->hasMany(Payment::class); }

    // Updated status names to match your list
    protected $statusNames = [
        1 => 'Pending',
        2 => 'In Transit',
        3 => 'Shipped',
        4 => 'Delivered',
        5 => 'Cancelled',
    ];

    protected static function booted()
    {
        static::updating(function ($order) {
            Log::info('Order updating', [
                'order_id' => $order->id,
                'original_status_id' => $order->getOriginal('status_id'),
                'new_status_id' => $order->status_id,
                'is_dirty' => $order->isDirty('status_id'),
            ]);
        });

        static::updated(function ($order) {
            Log::info('Order updated event fired', [
                'order_id' => $order->id,
                'original_status_id' => $order->getOriginal('status_id'),
                'new_status_id' => $order->status_id,
                'is_dirty' => $order->isDirty('status_id'),
            ]);

            if ($order->isDirty('status_id')) {
                $newStatus = $order->statusNames[$order->status_id] ?? 'Unknown';
                Notification::create([
                    'profile_id' => $order->profile_id,
                    'message' => "Your order #{$order->id} status changed to {$newStatus}.",
                    'type' => 'order_status',
                    'status' => 'unread',
                    'archived' => false,
                ]);
                Log::info('Notification created for order status change', [
                    'order_id' => $order->id,
                    'new_status' => $newStatus,
                    'profile_id' => $order->profile_id,
                ]);
            } else {
                Log::info('Status_id not dirty, no notification created', [
                    'order_id' => $order->id,
                    'status_id' => $order->status_id,
                ]);
            }
        });
    }

    public static function createOrder($data)
    {
        try {
            Log::info('Starting order creation', ['data' => $data]);

            if (!isset($data['profile_id']) || !isset($data['items']) || !isset($data['total_amount'])) {
                throw new \Exception('Missing required fields: profile_id, items, or total_amount');
            }

            DB::beginTransaction();

            $profileId = $data['profile_id'];
            $shippingMethod = $data['shipping_method'] ?? 'standard';
            $items = $data['items'];
            $totalAmount = $data['total_amount'];
            $paymentMethod = $data['payment_method'] ?? 'cash_on_delivery';

            $orderDate = Carbon::now();
            $estimatedDeliveryDate = $shippingMethod === 'standard'
                ? $orderDate->copy()->addDays(5)
                : $orderDate->copy()->addDays(2);

            $productId = $items[0]['product_id'] ?? null;
            if (!$productId) {
                throw new \Exception('No product_id found in items');
            }

            $totalQuantity = array_sum(array_column($items, 'quantity'));

            Log::info('Creating order', ['order_data' => [
                'profile_id' => $profileId,
                'product_id' => $productId,
                'quantity' => $totalQuantity,
            ]]);
            $order = self::create([
                'profile_id' => $profileId,
                'product_id' => $productId,
                'order_date' => $orderDate,
                'quantity' => $totalQuantity,
                'total_amount' => $totalAmount,
                'status_id' => 1,
                'estimated_delivery_date' => $estimatedDeliveryDate,
                'shipping_method' => $shippingMethod,
                'payment_method' => $paymentMethod,
            ]);

            Log::info('Order created', ['order_id' => $order->id]);

            foreach ($items as $item) {
                Log::info('Processing item', ['item' => $item]);
                $product = Product::find($item['product_id']);
                if (!$product) {
                    throw new \Exception("Product ID {$item['product_id']} not found");
                }
                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product ID {$item['product_id']}: Available {$product->quantity}, Requested {$item['quantity']}");
                }

                $product->quantity -= $item['quantity'];
                $product->sold = ($product->sold ?? 0) + $item['quantity'];
                $product->save();

                Log::info("Product updated", [
                    'product_id' => $item['product_id'],
                    'quantity' => $product->quantity,
                    'sold' => $product->sold,
                ]);

                DB::table('order_items')->insert([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'refunded' => false,
                ]);
            }

            Log::info('Inserting order history', ['order_id' => $order->id]);
            DB::table('order_histories')->insert([
                'order_id' => $order->id,
                'status_id' => 1,
                'updated_at' => $orderDate,
            ]);

            Log::info('Inserting payment', ['payment_method' => $paymentMethod]);
            if ($paymentMethod === 'credit_card') {
                $order->payments()->create([
                    'amount' => $totalAmount,
                    'payment_method' => 'credit_card',
                    'transaction_id' => 'CREDIT-' . time(),
                    'payment_date' => $orderDate,
                ]);
            } elseif ($paymentMethod === 'cash_on_delivery') {
                $order->payments()->create([
                    'amount' => $totalAmount,
                    'payment_method' => 'cash_on_delivery',
                    'transaction_id' => 'COD-' . time(),
                    'payment_date' => null,
                ]);
            } elseif ($paymentMethod === 'paypal') {
                $order->payments()->create([
                    'amount' => $totalAmount,
                    'payment_method' => 'paypal',
                    'transaction_id' => 'PAYPAL-' . time(),
                    'payment_date' => null,
                ]);
            } else {
                throw new \Exception("Unsupported payment method: {$paymentMethod}");
            }

            DB::commit();

            Log::info('Order creation successful', ['order' => $order->toArray()]);

            return [
                'message' => 'Order placed successfully',
                'total_amount' => $totalAmount,
                'estimated_delivery_date' => $estimatedDeliveryDate->toDateString(),
                'payment_method' => $paymentMethod,
                'order' => $order->load('payments'),
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data,
            ]);
            throw $e;
        }
    }
}