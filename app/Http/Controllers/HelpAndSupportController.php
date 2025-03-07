<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class HelpAndSupportController extends Controller
{
    public function getActiveFaqs(): JsonResponse
{
    try {
        Log::info('Fetching active FAQs - Starting');

        // Verify model loading
        if (!class_exists('App\Models\Faq')) {
            throw new \Exception('Faq model class not found');
        }

        $faqs = Faq::with('faqCategory')
            ->where('archived', false)
            ->get();

        Log::info('FAQs fetched:', ['count' => $faqs->count()]);

        $mappedFaqs = $faqs->map(function ($faq) {
            Log::info('Mapping FAQ:', [
                'id' => $faq->id,
                'faq_category_id' => $faq->faq_category_id,
                'category' => $faq->faqCategory ? $faq->faqCategory->name : 'null'
            ]);
            return [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'category' => ['name' => optional($faq->faqCategory)->name ?? 'Unknown'],
                'created_at' => $faq->created_at ? $faq->created_at->toISOString() : null,
                'updated_at' => $faq->updated_at ? $faq->updated_at->toISOString() : null,
            ];
        })->all();

        Log::info('FAQs mapped successfully', ['count' => count($mappedFaqs)]);
        return response()->json($mappedFaqs);
    } catch (\Exception $e) {
        Log::error('Error fetching active FAQs:', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json(['error' => 'Failed to fetch FAQs'], 500);
    }
}


    public function getArchivedFaqs(): JsonResponse
    {
        try {
            $faqs = Faq::with('faqCategory')
                ->where('archived', true)
                ->get()
                ->map(function ($faq) {
                    return [
                        'id' => $faq->id,
                        'question' => $faq->question,
                        'answer' => $faq->answer,
                        'category' => ['name' => optional($faq->faqCategory)->name ?? 'Unknown'],
                        'created_at' => $faq->created_at ? $faq->created_at->toISOString() : null,
                        'updated_at' => $faq->updated_at ? $faq->updated_at->toISOString() : null,
                    ];
                });

            return response()->json($faqs);
        } catch (\Exception $e) {
            Log::error('Error fetching archived FAQs:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to fetch archived FAQs'], 500);
        }
    }

    public function store(Request $request): JsonResponse
{
    try {
        Log::info('FAQ store request:', $request->all());

        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'faq_category_id' => 'required|exists:faq_categories,id', // Changed
        ]);

        $faq = Faq::create([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'faq_category_id' => $validated['faq_category_id'], // Changed
            'archived' => false,
        ]);

        $faq->load('faqCategory');

        return response()->json([
            'message' => 'FAQ created successfully',
            'faq' => [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'category_name' => optional($faq->faqCategory)->name ?? 'Unknown',
                'created_at' => $faq->created_at ? $faq->created_at->toISOString() : null,
                'updated_at' => $faq->updated_at ? $faq->updated_at->toISOString() : null,
            ],
        ], 201);
    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::error('Validation error in FAQ store:', ['errors' => $e->errors()]);
        return response()->json(['error' => $e->errors()], 422);
    } catch (\Exception $e) {
        Log::error('Error storing FAQ:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return response()->json(['error' => 'Failed to create FAQ'], 500);
    }
}
public function update(Request $request, $id): JsonResponse
    {
        try {
            Log::info('FAQ update request:', $request->all());

            $faq = Faq::findOrFail($id);

            $validated = $request->validate([
                'question' => 'required|string|max:255',
                'answer' => 'required|string',
                'faq_category_id' => 'required|exists:faq_categories,id',
            ]);

            $faq->update([
                'question' => $validated['question'],
                'answer' => $validated['answer'],
                'faq_category_id' => $validated['faq_category_id'],
            ]);

            $faq->load('faqCategory');

            return response()->json([
                'message' => 'FAQ updated successfully',
                'faq' => [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                    'category_name' => optional($faq->faqCategory)->name ?? 'Unknown',
                    'created_at' => $faq->created_at ? $faq->created_at->toISOString() : null,
                    'updated_at' => $faq->updated_at ? $faq->updated_at->toISOString() : null,
                ],
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('FAQ not found for update:', ['id' => $id]);
            return response()->json(['error' => 'FAQ not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in FAQ update:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating FAQ:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to update FAQ'], 500);
        }
    }
    
    public function archive(Request $request, $id): JsonResponse
    {
        try {
            $faq = Faq::findOrFail($id);

            $request->validate([
                'archived' => 'required|boolean',
            ]);

            $faq->archived = $request->input('archived');
            $faq->save();

            $faq->load('faqCategory');

            return response()->json([
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'category_name' => optional($faq->faqCategory)->name ?? 'Unknown',
                'created_at' => $faq->created_at ? $faq->created_at->toISOString() : null,
                'updated_at' => $faq->updated_at ? $faq->updated_at->toISOString() : null,
                'archived' => $faq->archived,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('FAQ not found:', ['id' => $id]);
            return response()->json(['error' => 'FAQ not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in FAQ archive:', ['errors' => $e->errors()]);
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error archiving FAQ:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to update FAQ'], 500);
        }
    }
}