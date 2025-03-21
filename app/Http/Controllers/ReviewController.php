<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * Fetch all active (non-archived) reviews.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $reviews = Review::where('archived', false)
                ->with(['user.profile'])
                ->get()
                ->map(function ($review) {
                    return $this->formatReview($review);
                });
            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Error fetching active reviews: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to fetch reviews: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Fetch all archived reviews.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function archived()
    {
        try {
            $reviews = Review::where('archived', true)
                ->with(['user.profile'])
                ->get()
                ->map(function ($review) {
                    return $this->formatReview($review);
                });
            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Error fetching archived reviews: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to fetch archived reviews: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Fetch a single review by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $review = Review::with(['user.profile'])->findOrFail($id);
            return response()->json($this->formatReview($review));
        } catch (\Exception $e) {
            Log::error('Error fetching review ID ' . $id . ': ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Review not found: ' . $e->getMessage()], 404);
        }
    }

    /**
     * Store a new review.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'user_id' => 'required|integer|exists:users,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string',
                'photo' => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('reviews', 'public');
                $validated['photo'] = '/storage/' . $path;
            }

            $review = Review::create($validated + ['archived' => false]);
            $review->load('user.profile');
            return response()->json($this->formatReview($review), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::info('Validation failed while creating review', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating review', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to create review: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing review.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $review = Review::findOrFail($id);
            $validated = $request->validate([
                'product_id' => 'integer|exists:products,id',
                'user_id' => 'integer|exists:users,id',
                'rating' => 'integer|min:1|max:5',
                'comment' => 'nullable|string',
                'photo' => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('photo')) {
                if ($review->photo) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $review->photo));
                }
                $path = $request->file('photo')->store('reviews', 'public');
                $validated['photo'] = '/storage/' . $path;
            }

            $review->update($validated);
            $review->load('user.profile');
            return response()->json($this->formatReview($review));
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::info('Validation failed while updating review', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating review ID ' . $id . ': ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to update review: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Archive or restore a review.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function archive(Request $request, $id)
    {
        try {
            $review = Review::findOrFail($id);
            $archived = $request->input('archived', false);
            $review->archived = filter_var($archived, FILTER_VALIDATE_BOOLEAN);
            $review->save();
            $review->load('user.profile');
            return response()->json([
                'message' => $review->archived ? 'Review archived' : 'Review restored',
                'review' => $this->formatReview($review)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error archiving/restoring review ID ' . $id . ': ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to archive/restore review: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Fetch reviews for a specific product (paginated).
     *
     * @param int $productId
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByProduct($productId, Request $request)
    {
        try {
            $perPage = $request->query('per_page', 10);
            $reviews = Review::where('product_id', $productId)
                ->where('archived', false)
                ->with(['user.profile'])
                ->paginate($perPage)
                ->through(function ($review) {
                    return $this->formatReview($review);
                });

            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Error fetching reviews for product ID ' . $productId . ': ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to fetch reviews: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Format a review for JSON response to avoid serialization issues.
     *
     * @param \App\Models\Review $review
     * @return array
     */
    private function formatReview($review)
    {
        return [
            'id' => $review->id,
            'product_id' => $review->product_id,
            'user_id' => $review->user_id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'photo' => $review->photo,
            'archived' => $review->archived,
            'created_at' => $review->created_at,
            'updated_at' => $review->updated_at,
            'user' => $review->user ? [
                'id' => $review->user->id,
                'profile' => $review->user->profile ? [
                    'first_name' => $review->user->profile->first_name,
                    'middlename' => $review->user->profile->middlename,
                    'last_name' => $review->user->profile->last_name,
                    'suffix' => $review->user->profile->suffix,
                    'profile_img' => $review->user->profile->profile_img,
                ] : null,
            ] : null,
        ];
    }
}