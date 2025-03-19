<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    public function getActiveProducts()
    {
        try {
            $products = DB::table('products')
                ->select('product_img', 'product_name', 'price', 'id', 'category_id', 'brand_id')
                ->where('archived', 0)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error fetching products: " . $e->getMessage()
            ], 500);
        }
    }

    // Add methods for fetching categories and brands (if not already present)
    public function getCategories()
    {
        try {
            $categories = DB::table('categories')
                ->select('id', 'category_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error fetching categories: " . $e->getMessage()
            ], 500);
        }
    }

    public function getBrands()
    {
        try {
            $brands = DB::table('brands')
                ->select('id', 'brand_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $brands
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error fetching brands: " . $e->getMessage()
            ], 500);
        }
    }
}