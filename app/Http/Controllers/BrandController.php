<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class BrandController extends Controller
{
    // Public: Fetch All Brands (for /api/brands)
    public function getBrands(): JsonResponse
    {
        try {
            $brands = Brand::all(); // Public route fetches all, regardless of archived
            return response()->json($brands->map(function ($brand) {
                return [
                    'id' => $brand->id,
                    'brand_name' => $brand->brand_name,
                    'created_at' => $brand->created_at ? $brand->created_at->toISOString() : null,
                    'updated_at' => $brand->updated_at ? $brand->updated_at->toISOString() : null,
                ];
            }));
        } catch (\Exception $e) {
            Log::error('Error fetching all brands:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch brands'], 500);
        }
    }

    // Admin: Fetch Active Brands (for /api/brands/active)
    public function getActiveBrands(): JsonResponse
    {
        try {
            $brands = Brand::where('archived', false)->get();
            return response()->json($brands->map(function ($brand) {
                return [
                    'id' => $brand->id,
                    'brand_name' => $brand->brand_name,
                    'created_at' => $brand->created_at ? $brand->created_at->toISOString() : null,
                    'updated_at' => $brand->updated_at ? $brand->updated_at->toISOString() : null,
                ];
            }));
        } catch (\Exception $e) {
            Log::error('Error fetching active brands:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch brands'], 500);
        }
    }

    // Admin: Fetch Archived Brands
    public function getArchivedBrands(): JsonResponse
    {
        try {
            $brands = Brand::where('archived', true)->get();
            return response()->json($brands->map(function ($brand) {
                return [
                    'id' => $brand->id,
                    'brand_name' => $brand->brand_name,
                    'created_at' => $brand->created_at ? $brand->created_at->toISOString() : null,
                    'updated_at' => $brand->updated_at ? $brand->updated_at->toISOString() : null,
                ];
            }));
        } catch (\Exception $e) {
            Log::error('Error fetching archived brands:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch archived brands'], 500);
        }
    }

    // Admin: Store Brand
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Store brand request:', $request->all());
            $validated = $request->validate([
                'brand_name' => 'required|string|max:255',
            ]);

            $brand = Brand::create([
                'brand_name' => $validated['brand_name'],
                'archived' => false,
            ]);

            return response()->json([
                'message' => 'Brand created successfully',
                'brand' => [
                    'id' => $brand->id,
                    'brand_name' => $brand->brand_name,
                    'created_at' => $brand->created_at ? $brand->created_at->toISOString() : null,
                    'updated_at' => $brand->updated_at ? $brand->updated_at->toISOString() : null,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in brand store:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error storing brand:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create brand'], 500);
        }
    }

    // Admin: Archive/Restore Brand
    public function archive(Request $request, $id): JsonResponse
    {
        try {
            $brand = Brand::findOrFail($id);
            $request->validate(['archived' => 'required|boolean']);
            $brand->archived = $request->input('archived');
            $brand->save();

            return response()->json([
                'id' => $brand->id,
                'brand_name' => $brand->brand_name,
                'created_at' => $brand->created_at ? $brand->created_at->toISOString() : null,
                'updated_at' => $brand->updated_at ? $brand->updated_at->toISOString() : null,
                'archived' => $brand->archived,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Brand not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error archiving brand:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update brand'], 500);
        }
    }
    public function update(Request $request, $id): JsonResponse
    {
        try {
            Log::info('Brand update request:', $request->all());

            $brand = Brand::findOrFail($id);

            $validated = $request->validate([
                'brand_name' => 'required|string|max:255',
            ]);

            $brand->update([
                'brand_name' => $validated['brand_name'],
            ]);

            return response()->json([
                'message' => 'Brand updated successfully',
                'brand' => [
                    'id' => $brand->id,
                    'brand_name' => $brand->brand_name,
                    'created_at' => $brand->created_at ? $brand->created_at->toISOString() : null,
                    'updated_at' => $brand->updated_at ? $brand->updated_at->toISOString() : null,
                    'archived' => $brand->archived,
                ],
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Brand not found for update:', ['id' => $id]);
            return response()->json(['error' => 'Brand not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in brand update:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating brand:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to update brand'], 500);
        }
    }
}