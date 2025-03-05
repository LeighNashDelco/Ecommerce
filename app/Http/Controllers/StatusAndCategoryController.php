<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Status;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class StatusAndCategoryController extends Controller
{
    // Fetch Active Statuses
    public function getActiveStatuses(): JsonResponse
    {
        try {
            $statuses = Status::where('archived', false)->get();
            $data = $statuses->map(function ($status) {
                return [
                    'id' => $status->id,
                    'status_name' => $status->status_name,
                    'created_at' => $status->created_at ? $status->created_at->toISOString() : null,
                    'updated_at' => $status->updated_at ? $status->updated_at->toISOString() : null,
                ];
            })->all(); // Ensure collection is converted to array
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching active statuses:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch statuses'], 500);
        }
    }

    // Fetch Archived Statuses
    public function getArchivedStatuses(): JsonResponse
    {
        try {
            $statuses = Status::where('archived', true)->get();
            $data = $statuses->map(function ($status) {
                return [
                    'id' => $status->id,
                    'status_name' => $status->status_name,
                    'created_at' => $status->created_at ? $status->created_at->toISOString() : null,
                    'updated_at' => $status->updated_at ? $status->updated_at->toISOString() : null,
                ];
            })->all(); // Ensure collection is converted to array
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching archived statuses:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch archived statuses'], 500);
        }
    }

    // Fetch Active Categories
    public function getActiveCategories(): JsonResponse
    {
        try {
            $categories = Category::where('archived', false)->get();
            $data = $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'category_name' => $category->category_name,
                    'created_at' => $category->created_at ? $category->created_at->toISOString() : null,
                    'updated_at' => $category->updated_at ? $category->updated_at->toISOString() : null,
                ];
            })->all();
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching active categories:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch categories'], 500);
        }
    }

    // Fetch Archived Categories
    public function getArchivedCategories(): JsonResponse
    {
        try {
            $categories = Category::where('archived', true)->get();
            $data = $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'category_name' => $category->category_name,
                    'created_at' => $category->created_at ? $category->created_at->toISOString() : null,
                    'updated_at' => $category->updated_at ? $category->updated_at->toISOString() : null,
                ];
            })->all();
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error fetching archived categories:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch archived categories'], 500);
        }
    }

    // Store Status
    public function storeStatus(Request $request): JsonResponse
    {
        try {
            Log::info('Store status request:', $request->all());
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $status = Status::create([
                'status_name' => $validated['name'],
                'archived' => false,
            ]);

            return response()->json([
                'message' => 'Status created successfully',
                'item' => [
                    'id' => $status->id,
                    'name' => $status->status_name,
                    'created_at' => $status->created_at ? $status->created_at->toISOString() : null,
                    'updated_at' => $status->updated_at ? $status->updated_at->toISOString() : null,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in status store:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error storing status:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create status'], 500);
        }
    }

    // Store Category
    public function storeCategory(Request $request): JsonResponse
    {
        try {
            Log::info('Store category request:', $request->all());
            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $category = Category::create([
                'category_name' => $validated['name'],
                'archived' => false,
            ]);

            return response()->json([
                'message' => 'Category created successfully',
                'item' => [
                    'id' => $category->id,
                    'name' => $category->category_name,
                    'created_at' => $category->created_at ? $category->created_at->toISOString() : null,
                    'updated_at' => $category->updated_at ? $category->updated_at->toISOString() : null,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in category store:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error storing category:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create category'], 500);
        }
    }

    // Archive/Restore Status
    public function archiveStatus(Request $request, $id): JsonResponse
    {
        try {
            $status = Status::findOrFail($id);
            $request->validate(['archived' => 'required|boolean']);
            $status->archived = $request->input('archived');
            $status->save();

            return response()->json([
                'id' => $status->id,
                'status_name' => $status->status_name,
                'created_at' => $status->created_at ? $status->created_at->toISOString() : null,
                'updated_at' => $status->updated_at ? $status->updated_at->toISOString() : null,
                'archived' => $status->archived,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Status not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error archiving status:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update status'], 500);
        }
    }

    // Archive/Restore Category
    public function archiveCategory(Request $request, $id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);
            $request->validate(['archived' => 'required|boolean']);
            $category->archived = $request->input('archived');
            $category->save();

            return response()->json([
                'id' => $category->id,
                'category_name' => $category->category_name,
                'created_at' => $category->created_at ? $category->created_at->toISOString() : null,
                'updated_at' => $category->updated_at ? $category->updated_at->toISOString() : null,
                'archived' => $category->archived,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Category not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error archiving category:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update category'], 500);
        }
    }
    public function updateStatus(Request $request, $id): JsonResponse
    {
        try {
            Log::info('Status update request:', $request->all());

            $status = Status::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $status->update([
                'status_name' => $validated['name'],
            ]);

            return response()->json([
                'message' => 'Status updated successfully',
                'item' => [
                    'id' => $status->id,
                    'name' => $status->status_name,
                    'created_at' => $status->created_at ? $status->created_at->toISOString() : null,
                    'updated_at' => $status->updated_at ? $status->updated_at->toISOString() : null,
                    'archived' => $status->archived,
                ],
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Status not found for update:', ['id' => $id]);
            return response()->json(['error' => 'Status not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in status update:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating status:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to update status'], 500);
        }
    }

    public function updateCategory(Request $request, $id): JsonResponse
    {
        try {
            Log::info('Category update request:', $request->all());

            $category = Category::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $category->update([
                'category_name' => $validated['name'],
            ]);

            return response()->json([
                'message' => 'Category updated successfully',
                'item' => [
                    'id' => $category->id,
                    'name' => $category->category_name,
                    'created_at' => $category->created_at ? $category->created_at->toISOString() : null,
                    'updated_at' => $category->updated_at ? $category->updated_at->toISOString() : null,
                    'archived' => $category->archived,
                ],
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Category not found for update:', ['id' => $id]);
            return response()->json(['error' => 'Category not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in category update:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating category:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to update category'], 500);
        }
    }
}