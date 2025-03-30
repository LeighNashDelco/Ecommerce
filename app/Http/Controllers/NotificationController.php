<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api'); // Ensure only authenticated users access these routes
    }

    public function index(Request $request)
    {
        try {
            $profileId = Auth::user()->profile->id;
            $notifications = Notification::where('profile_id', $profileId)
                ->where('archived', false)
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch notifications: ' . $e->getMessage()], 500);
        }
    }

    public function archived()
    {
        try {
            $profileId = Auth::user()->profile->id;
            $notifications = Notification::where('profile_id', $profileId)
                ->where('archived', true)
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch archived notifications: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $profileId = Auth::user()->profile->id;
            $notification = Notification::where('profile_id', $profileId)
                ->where('id', $id)
                ->firstOrFail();
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
            $profileId = Auth::user()->profile->id;
            $notification = Notification::where('profile_id', $profileId)
                ->where('id', $id)
                ->firstOrFail();
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
            $profileId = Auth::user()->profile->id;
            $notification = Notification::where('profile_id', $profileId)
                ->where('id', $id)
                ->firstOrFail();
            $notification->archived = true;
            $notification->save();
            return response()->json(['message' => 'Notification archived']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to archive notification: ' . $e->getMessage()], 500);
        }
    }

    public function markAsRead(Request $request, $id)
    {
        try {
            $profileId = Auth::user()->profile->id;
            $notification = Notification::where('profile_id', $profileId)
                ->where('id', $id)
                ->firstOrFail();
            $notification->status = 'read';
            $notification->save();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to mark notification as read: ' . $e->getMessage()], 500);
        }
    }

    // Added: Mark all notifications as read
    public function markAllAsRead(Request $request)
    {
        try {
            $profileId = Auth::user()->profile->id;
            Notification::where('profile_id', $profileId)
                ->where('status', 'unread')
                ->where('archived', false)
                ->update(['status' => 'read']);
            return response()->json(['message' => 'All notifications marked as read']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to mark all notifications as read: ' . $e->getMessage()], 500);
        }
    }

    // Added: Delete a notification
    public function delete($id)
    {
        try {
            $profileId = Auth::user()->profile->id;
            $notification = Notification::where('profile_id', $profileId)
                ->where('id', $id)
                ->firstOrFail();
            $notification->delete();
            return response()->json(['message' => 'Notification deleted']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete notification: ' . $e->getMessage()], 500);
        }
    }
}