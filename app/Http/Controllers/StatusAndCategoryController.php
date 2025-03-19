<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Status;
use App\Models\Category;

class StatusAndCategoryController extends Controller
{
    // Status Methods
    public function getActiveStatuses()
    {
        $statuses = Status::where('archived', false)->get();
        return response()->json($statuses);
    }

    public function getArchivedStatuses()
    {
        $statuses = Status::where('archived', true)->get();
        return response()->json($statuses);
    }

    public function storeStatus(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $status = Status::create([
            'status_name' => $request->name,
            'archived' => false,
        ]);

        return response()->json(['item' => [
            'id' => $status->id,
            'name' => $status->status_name,
            'created_at' => $status->created_at,
            'updated_at' => $status->updated_at,
        ]], 201);
    }

    public function archiveStatus($id)
    {
        $status = Status::findOrFail($id);
        $status->update(['archived' => request('archived', true)]);
        return response()->json(['item' => [
            'id' => $status->id,
            'name' => $status->status_name,
            'created_at' => $status->created_at,
            'updated_at' => $status->updated_at,
        ]]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $status = Status::findOrFail($id);
        $status->update(['status_name' => $request->name]);

        return response()->json(['item' => [
            'id' => $status->id,
            'name' => $status->status_name,
            'created_at' => $status->created_at,
            'updated_at' => $status->updated_at,
        ]]);
    }

    // Category Methods
    public function getActiveCategories()
    {
        $categories = Category::where('archived', false)->get();
        return response()->json($categories);
    }

    public function getArchivedCategories()
    {
        $categories = Category::where('archived', true)->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create([
            'category_name' => $request->name,
            'archived' => false,
        ]);

        return response()->json(['item' => [
            'id' => $category->id,
            'name' => $category->category_name,
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
        ]], 201);
    }

    public function archiveCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->update(['archived' => request('archived', true)]);
        return response()->json(['item' => [
            'id' => $category->id,
            'name' => $category->category_name,
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
        ]]);
    }

    public function updateCategory(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($id);
        $category->update(['category_name' => $request->name]);

        return response()->json(['item' => [
            'id' => $category->id,
            'name' => $category->category_name,
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
        ]]);
    }
}