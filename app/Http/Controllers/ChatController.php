<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function sendMessage(Request $request)
    {
        try {
            Log::info('sendMessage called', ['input' => $request->all()]);
            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            Log::info('User authenticated', ['user_id' => $user->id]);

            // Validate the request
            $validated = $request->validate([
                'message' => 'string|max:1000|nullable', // Make message nullable
                'image' => 'nullable|image|max:2048', // Add image support
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('chat_images', 'public');
            }

            // Ensure message is never null; use a default if not provided
            $messageContent = $validated['message'] ?? ($imagePath ? '[Image]' : '');

            $message = ChatMessage::create([
                'user_id' => $user->id,
                'message' => $messageContent,
                'image' => $imagePath,
                'is_admin_reply' => false,
            ]);

            Log::info('Message created', ['message_id' => $message->id]);

            return response()->json(['message' => 'Question sent', 'data' => $message], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors with a 422 status
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error in sendMessage', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['error' => 'Failed to send message: ' . $e->getMessage()], 500);
        }
    }

    public function getCustomerMessages(Request $request)
    {
        try {
            Log::info('getCustomerMessages called');
            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $messages = ChatMessage::where('user_id', $user->id)
                ->orderBy('created_at', 'asc')
                ->with('user.profile')
                ->get();

            Log::info('Messages fetched', ['count' => $messages->count()]);

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error in getCustomerMessages', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['error' => 'Failed to fetch messages: ' . $e->getMessage()], 500);
        }
    }

    public function getAllMessages(Request $request)
    {
        try {
            Log::info('getAllMessages called');
            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            Log::info('User authenticated', [
                'user_id' => $user->id,
                'role' => $user->role ?? 'Not set'
            ]);

            $messages = ChatMessage::orderBy('created_at', 'asc')
                ->with(['user' => function ($query) {
                    $query->select('id', 'username')
                          ->with(['profile' => function ($query) {
                              $query->select('id', 'user_id', 'profile_img');
                          }]);
                }])
                ->get();

            Log::info('Messages fetched with user and profile', ['count' => $messages->count()]);

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error in getAllMessages', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['error' => 'Failed to fetch messages: ' . $e->getMessage()], 500);
        }
    }

    public function replyMessage(Request $request)
    {
        try {
            Log::info('replyMessage called', ['input' => $request->all()]);
            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            Log::info('User authenticated', ['user_id' => $user->id]);

            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'message' => 'string|max:1000|nullable',
                'image' => 'nullable|image|max:2048',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('chat_images', 'public');
            }

            $messageContent = $validated['message'] ?? ($imagePath ? '[Image]' : '');

            $message = ChatMessage::create([
                'user_id' => $validated['user_id'],
                'message' => $messageContent,
                'image' => $imagePath,
                'is_admin_reply' => true,
            ]);

            Log::info('Reply created', ['message_id' => $message->id]);

            return response()->json(['message' => 'Reply sent', 'data' => $message], 201);
        } catch (\Exception $e) {
            Log::error('Error in replyMessage', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to send reply: ' . $e->getMessage()], 500);
        }
    }

    public function deleteMessage(Request $request, $id)
    {
        try {
            Log::info('deleteMessage called', ['message_id' => $id]);
            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $message = ChatMessage::findOrFail($id);

            // Allow customers to delete their own messages, admins to delete their replies
            if ($message->is_admin_reply && !$user->is_admin) {
                return response()->json(['error' => 'You can only delete your own admin replies'], 403);
            }
            if (!$message->is_admin_reply && $message->user_id !== $user->id) {
                return response()->json(['error' => 'You can only delete your own messages'], 403);
            }

            if ($message->image) {
                Storage::disk('public')->delete($message->image);
            }
            $message->delete();

            Log::info('Message deleted', ['message_id' => $id]);
            return response()->json(['message' => 'Message deleted']);
        } catch (\Exception $e) {
            Log::error('Error in deleteMessage', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to delete message: ' . $e->getMessage()], 500);
        }
    }
}