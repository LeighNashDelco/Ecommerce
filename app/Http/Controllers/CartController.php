<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getCart($profileId)
    {
        try {
            $cartItems = Cart::where('profile_id', $profileId)
                ->with(['product' => function ($query) {
                    $query->select('id', 'product_name', 'price', 'quantity', 'product_img');
                }])
                ->get()
                ->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->product_name,
                        'price' => $item->product->price,
                        'quantity' => $item->quantity,
                        'quantity_available' => $item->product->quantity,
                        'product_img' => $item->product->product_img,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $cartItems,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cart items: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getCartCount(Request $request)
    {
        try {
            $user = $request->user();
            $profile = $user->profile;
            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found for the authenticated user',
                ], 404);
            }

            $count = Cart::where('profile_id', $profile->id)->count();

            return response()->json([
                'success' => true,
                'count' => $count,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cart count: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_id' => 'required|exists:profiles,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $product = Product::find($request->product_id);
            if (!$product || $product->quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not available or insufficient stock',
                ], 400);
            }

            $cartItem = Cart::updateOrCreate(
                ['profile_id' => $request->profile_id, 'product_id' => $request->product_id],
                ['quantity' => \DB::raw("quantity + {$request->quantity}")]
            );

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart successfully',
                'data' => $cartItem,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add to cart: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_id' => 'required|exists:profiles,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $cartItem = Cart::where('profile_id', $request->profile_id)
                ->where('product_id', $request->product_id)
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found',
                ], 404);
            }

            $product = Product::find($request->product_id);
            if ($request->quantity > $product->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Requested quantity exceeds available stock',
                ], 400);
            }

            $cartItem->quantity = $request->quantity;
            $cartItem->save();

            return response()->json([
                'success' => true,
                'message' => 'Cart updated successfully',
                'data' => $cartItem,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function removeFromCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_id' => 'required|exists:profiles,id',
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $cartItem = Cart::where('profile_id', $request->profile_id)
                ->where('product_id', $request->product_id)
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found',
                ], 404);
            }

            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove from cart: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function clearCart($profileId)
    {
        try {
            $deleted = Cart::where('profile_id', $profileId)->delete();

            if ($deleted === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No cart items found for this profile',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart: ' . $e->getMessage(),
            ], 500);
        }
    }
}