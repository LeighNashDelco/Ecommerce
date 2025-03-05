<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\FaqCategory;
use Illuminate\Support\Facades\Log;

class FaqCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            Log::info('Fetching FAQ categories - Starting');
            $categories = FaqCategory::all(); // Remove archived filter since field doesn’t exist
            Log::info('FAQ categories fetched:', ['count' => $categories->count()]);

            $mappedCategories = $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            })->all();

            Log::info('FAQ categories mapped successfully', ['count' => count($mappedCategories)]);
            return response()->json($mappedCategories);
        } catch (\Exception $e) {
            Log::error('Error fetching FAQ categories:', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to fetch FAQ categories'], 500);
        }
    }
}