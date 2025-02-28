<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'brand_id' => 'required|exists:brands,id',
            'category_id' => 'required|exists:categories,id',
            'product_img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $profile = $user->profile;
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $product = new Product();
        $product->product_name = $request->input('product_name');
        $product->description = $request->input('description');
        $product->price = $request->input('price');
        $product->quantity = $request->input('quantity');
        $product->brand_id = $request->input('brand_id');
        $product->category_id = $request->input('category_id');
        $product->profile_id = $profile->id;

        if ($request->hasFile('product_img')) {
            $image = $request->file('product_img');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $destinationPath = public_path('images/products/');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $image->move($destinationPath, $imageName);
            $product->product_img = 'images/products/' . $imageName;
        }

        $product->created_at = now();
        $product->save();

        $product->load('seller', 'category', 'brand');
        return response()->json([
            'id' => $product->id,
            'product_name' => $product->product_name,
            'description' => $product->description,
            'price' => number_format($product->price, 2),
            'quantity' => $product->quantity,
            'product_img' => $product->product_img,
            'category' => optional($product->category)->category_name ?? 'Unknown Category',
            'brand' => optional($product->brand)->brand_name ?? 'Unknown Brand',
            'profile_name' => optional($product->seller)
                ? optional($product->seller)->first_name . ' ' . optional($product->seller)->last_name
                : 'Unknown Seller',
            'created_at' => Carbon::parse($product->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::parse($product->updated_at)->format('Y-m-d H:i:s'),
            'archived' => $product->archived,
        ], 201);
    }

    public function getProducts(): JsonResponse
    {
        $products = Product::with(['seller', 'category', 'brand'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_name' => $product->product_name,
                    'description' => $product->description,
                    'price' => number_format($product->price, 2),
                    'quantity' => $product->quantity,
                    'product_img' => $product->product_img,
                    'category' => optional($product->category)->category_name ?? 'Unknown Category',
                    'category_id' => $product->category_id,
                    'brand' => optional($product->brand)->brand_name ?? 'Unknown Brand',
                    'brand_id' => $product->brand_id,
                    'profile_name' => optional($product->seller)
                        ? optional($product->seller)->first_name . ' ' . optional($product->seller)->last_name
                        : 'Unknown Seller',
                    'created_at' => Carbon::parse($product->created_at)->format('Y-m-d H:i:s'),
                    'updated_at' => Carbon::parse($product->updated_at)->format('Y-m-d H:i:s'),
                    'archived' => $product->archived,
                ];
            });
        return response()->json($products);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Log raw request data for debugging
        \Log::info('Raw request data:', [
            'all' => $request->all(),
            'files' => $request->files->all(),
            'headers' => $request->headers->all(),
            'rawBody' => $request->getContent(),
            'inputs' => [
                'product_name' => $request->input('product_name'),
                'price' => $request->input('price'),
                'quantity' => $request->input('quantity'),
                'brand_id' => $request->input('brand_id'),
                'category_id' => $request->input('category_id'),
                'product_img' => $request->hasFile('product_img') ? 'present' : 'absent',
            ],
        ]);

        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'brand_id' => 'required|exists:brands,id',
            'category_id' => 'required|exists:categories,id',
            'product_img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product->product_name = $request->input('product_name');
        $product->description = $request->input('description');
        $product->price = $request->input('price');
        $product->quantity = $request->input('quantity');
        $product->brand_id = $request->input('brand_id');
        $product->category_id = $request->input('category_id');

        if ($request->hasFile('product_img')) {
            if ($product->product_img && Storage::exists($product->product_img)) {
                Storage::delete($product->product_img);
            }
            $image = $request->file('product_img');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $destinationPath = public_path('images/products/');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $image->move($destinationPath, $imageName);
            $product->product_img = 'images/products/' . $imageName;
        }

        $product->updated_at = now();
        $product->save();

        $product->load('seller', 'category', 'brand');
        return response()->json([
            'id' => $product->id,
            'product_name' => $product->product_name,
            'description' => $product->description,
            'price' => $product->price, // Raw price for frontend compatibility
            'quantity' => $product->quantity,
            'product_img' => $product->product_img,
            'category' => optional($product->category)->category_name ?? 'Unknown Category',
            'brand' => optional($product->brand)->brand_name ?? 'Unknown Brand',
            'profile_name' => optional($product->seller)
                ? optional($product->seller)->first_name . ' ' . optional($product->seller)->last_name
                : 'Unknown Seller',
            'created_at' => Carbon::parse($product->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::parse($product->updated_at)->format('Y-m-d H:i:s'),
            'archived' => $product->archived,
        ]);
    }

    public function archive(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        $request->validate(['archived' => 'required|boolean']);
        $product->archived = $request->input('archived');
        $product->save();
        $product->load('seller', 'category', 'brand');
        return response()->json([
            'id' => $product->id,
            'product_name' => $product->product_name,
            'description' => $product->description,
            'price' => number_format($product->price, 2),
            'quantity' => $product->quantity,
            'product_img' => $product->product_img,
            'category' => optional($product->category)->category_name ?? 'Unknown Category',
            'brand' => optional($product->brand)->brand_name ?? 'Unknown Brand',
            'profile_name' => optional($product->seller)
                ? optional($product->seller)->first_name . ' ' . optional($product->seller)->last_name
                : 'Unknown Seller',
            'created_at' => Carbon::parse($product->created_at)->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::parse($product->updated_at)->format('Y-m-d H:i:s'),
            'archived' => $product->archived,
        ]);
    }
}