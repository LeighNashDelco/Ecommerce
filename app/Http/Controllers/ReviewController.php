<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        try {
            $reviews = Review::where('archived', false)->get();
            return response()->json($reviews);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch reviews: ' . $e->getMessage()], 500);
        }
    }

    public function archived()
    {
        try {
            $reviews = Review::where('archived', true)->get();
            return response()->json($reviews);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch archived reviews: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $review = Review::findOrFail($id);
            return response()->json($review);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Review not found: ' . $e->getMessage()], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'profile_id' => 'required|integer|exists:profiles,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string',
            ]);
            $review = Review::create($validated + ['archived' => false]);
            return response()->json($review, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create review: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $review = Review::findOrFail($id);
            $validated = $request->validate([
                'product_id' => 'integer|exists:products,id',
                'profile_id' => 'integer|exists:profiles,id',
                'rating' => 'integer|min:1|max:5',
                'comment' => 'nullable|string',
            ]);
            $review->update($validated);
            return response()->json($review);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update review: ' . $e->getMessage()], 500);
        }
    }

    public function archive($id)
    {
        try {
            $review = Review::findOrFail($id);
            $review->archived = true;
            $review->save();
            return response()->json(['message' => 'Review archived']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to archive review: ' . $e->getMessage()], 500);
        }
    }
}