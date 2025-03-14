<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        try {
            $notifications = Notification::where('archived', false)->get();
            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch notifications: ' . $e->getMessage()], 500);
        }
    }

    public function archived()
    {
        try {
            $notifications = Notification::where('archived', true)->get();
            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch archived notifications: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            return response()->json($notification);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Notification not found: ' . $e->getMessage()], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'profile_id' => 'required|integer|exists:profiles,id',
                'message' => 'required|string',
                'faqs_id' => 'nullable|integer|exists:faqs,id',
                'type' => 'required|string',
                'status' => 'required|string',
            ]);
            $notification = Notification::create($validated + ['archived' => false]);
            return response()->json($notification, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create notification: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $validated = $request->validate([
                'profile_id' => 'integer|exists:profiles,id',
                'message' => 'string',
                'faqs_id' => 'nullable|integer|exists:faqs,id',
                'type' => 'string',
                'status' => 'string',
            ]);
            $notification->update($validated);
            return response()->json($notification);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update notification: ' . $e->getMessage()], 500);
        }
    }

    public function archive($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->archived = true;
            $notification->save();
            return response()->json(['message' => 'Notification archived']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to archive notification: ' . $e->getMessage()], 500);
        }
    }
}