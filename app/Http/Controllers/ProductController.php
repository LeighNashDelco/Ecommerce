<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'product_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'brand_id' => 'required|exists:brands,id',
            'category_id' => 'required|exists:categories,id',
            'product_img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate the image
        ]);

        // Get logged-in user
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Retrieve the profile_id of the logged-in user
        $profile = $user->profile; // Assuming a `hasOne` relationship in User model

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        // Create a new product record using form data
        $product = new Product();
        $product->product_name = $request->input('product_name');
        $product->description = $request->input('description');
        $product->price = $request->input('price');
        $product->quantity = $request->input('quantity');
        $product->brand_id = $request->input('brand_id');
        $product->category_id = $request->input('category_id');
        $product->profile_id = $profile->id; // Use logged-in user's profile_id

        // Handle product image if provided
        if ($request->hasFile('product_img')) {
            $image = $request->file('product_img');
            $imageName = time() . '_' . $image->getClientOriginalName(); // Unique name
            $destinationPath = public_path('images/products/');
            
            // Ensure directory exists
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            $image->move($destinationPath, $imageName);
            
            // Store the relative path
            $product->product_img = 'images/products/' . $imageName;
        }

        $product->created_at = now(); // Use current timestamp
        $product->save();

        return response()->json(['message' => 'Product added successfully'], 201);
    }

    public function getProducts(): JsonResponse
    {
        // Fetch products with related data (seller, category, brand)
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
                    'brand' => optional($product->brand)->brand_name ?? 'Unknown Brand',
                    'profile_name' => optional($product->seller) ? optional($product->seller)->first_name . ' ' . optional($product->seller)->last_name : 'Unknown Seller',
                    'created_at' => Carbon::parse($product->created_at)->format('Y-m-d H:i:s'),
                    'updated_at' => Carbon::parse($product->updated_at)->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json($products);
    }
}
