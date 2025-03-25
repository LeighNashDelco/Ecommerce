<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class Order extends Model
{
    protected $fillable = [
        'profile_id',
        'product_id',
        'order_date',
        'quantity',
        'total_amount',
        'status_id',
        'estimated_delivery_date',
        'payment_method',
        'shipping_method',
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'estimated_delivery_date' => 'datetime',
    ];

    public function profile() { return $this->belongsTo(Profile::class); }
    public function product() { return $this->belongsTo(Product::class); }
    public function status() { return $this->belongsTo(Status::class, 'status_id'); }
    public function payments() { return $this->hasMany(Payment::class); }

    public static function createOrder($data)
    {
        try {
            Log::info('Starting order creation', ['data' => $data]);

            // Validate required fields
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

            $createdOrders = [];
            $itemCount = count($items);
            $subtotal = array_sum(array_map(fn($item) => $item['price'] * $item['quantity'], $items));
            $shippingCost = $totalAmount - $subtotal;
            $shippingPerItem = $itemCount > 0 ? $shippingCost / $itemCount : 0;

            foreach ($items as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    throw new \Exception("Product ID {$item['product_id']} not found");
                }
                if (!isset($item['quantity']) || $product->quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product ID {$item['product_id']}: Available {$product->quantity}, Requested {$item['quantity']}");
                }

                $originalQuantity = $product->quantity;
                $originalSold = $product->sold ?? 0;
                $product->quantity -= $item['quantity'];
                $product->sold = $originalSold + $item['quantity'];
                $product->save();

                Log::info("Product updated", [
                    'product_id' => $item['product_id'],
                    'quantity' => $product->quantity,
                    'sold' => $product->sold,
                ]);

                $itemTotal = ($item['price'] * $item['quantity']) + $shippingPerItem;
                $order = self::create([
                    'profile_id' => $profileId,
                    'product_id' => $item['product_id'],
                    'order_date' => $orderDate,
                    'quantity' => $item['quantity'],
                    'total_amount' => $itemTotal,
                    'status_id' => 1,
                    'estimated_delivery_date' => $estimatedDeliveryDate,
                    'shipping_method' => $shippingMethod,
                    'payment_method' => $paymentMethod,
                ]);

                DB::table('order_items')->insert([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'refunded' => false,
                ]);

                DB::table('order_histories')->insert([
                    'order_id' => $order->id,
                    'status_id' => 1,
                ]);

                if ($paymentMethod === 'credit_card') {
                    $order->payments()->create([
                        'amount' => $order->total_amount,
                        'payment_method' => 'credit_card',
                        'transaction_id' => 'CREDIT-' . time(),
                        'payment_date' => $orderDate,
                    ]);
                } elseif ($paymentMethod === 'cash_on_delivery') {
                    $order->payments()->create([
                        'amount' => $order->total_amount,
                        'payment_method' => 'cash_on_delivery',
                        'transaction_id' => 'COD-' . time(),
                        'payment_date' => null,
                    ]);
                } elseif ($paymentMethod === 'paypal') {
                    $order->payments()->create([
                        'amount' => $order->total_amount,
                        'payment_method' => 'paypal',
                        'transaction_id' => 'PAYPAL-' . time(),
                        'payment_date' => null, // Update later after PayPal confirmation
                    ]);
                } else {
                    throw new \Exception("Unsupported payment method: {$paymentMethod}");
                }

                $createdOrders[] = $order;
            }

            DB::commit();

            Log::info('Order creation successful', ['orders' => $createdOrders]);

            return [
                'message' => 'Order placed successfully',
                'total_amount' => $totalAmount,
                'estimated_delivery_date' => $estimatedDeliveryDate->toDateString(),
                'payment_method' => $paymentMethod,
                'orders' => $createdOrders,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return [
                'error' => $e->getMessage(),
                'status' => 500,
            ];
        }
    }
}