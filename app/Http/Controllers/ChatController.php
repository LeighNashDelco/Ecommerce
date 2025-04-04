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

    public function store(Request $request)
    {
        try {
            Log::info('store called', ['input' => $request->all()]);

            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            Log::info('User authenticated', ['user_id' => $user->id]);

            $validated = $request->validate([
                'message' => 'nullable|string|max:1000|required_without:image',
                'image' => 'nullable|file|mimes:jpg,jpeg,png,gif,bmp,webp|max:10240',
            ]);

            if (empty($validated['message']) && !$request->hasFile('image')) {
                Log::error('No message or image provided');
                return response()->json(['error' => 'Message or image required'], 422);
            }

            $attachmentPath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $attachmentPath = $file->storeAs('public/images/chat', $filename);
                Log::info('Image stored', ['path' => $attachmentPath]);
            }

            $messageText = $validated['message'] ?? '';

            $message = ChatMessage::create([
                'user_id' => $user->id,
                'message' => $messageText,
                'is_admin_reply' => false,
                'attachment_path' => $attachmentPath,
            ]);

            Log::info('Message created', ['message_id' => $message->id]);

            return response()->json(['message' => 'Message sent', 'data' => $message], 201);
        } catch (\Exception $e) {
            Log::error('Error in store', [
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

            Log::info('User authenticated', ['user_id' => $user->id]);

            $messages = ChatMessage::where('user_id', $user->id)
                ->where(function ($query) use ($user) {
                    $query->whereNull('deleted_for')
                          ->orWhere('deleted_for', '!=', 'everyone')
                          ->orWhere('deleted_for', '!=', 'user');
                })
                ->orderBy('created_at', 'asc')
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

            Log::info('User authenticated', ['user_id' => $user->id]);

            $messages = ChatMessage::whereNull('deleted_for')
                ->orWhere('deleted_for', '!=', 'everyone')
                ->orderBy('created_at', 'asc')
                ->get();

            Log::info('Messages fetched without user relationship', ['count' => $messages->count()]);

            $userIds = $messages->pluck('user_id')->unique()->toArray();
            $users = \App\Models\User::without(['role', 'profile'])
                ->whereIn('id', $userIds)
                ->select('id', 'username')
                ->get()
                ->keyBy('id');

            Log::info('Users fetched', ['count' => $users->count()]);

            $messages = $messages->map(function ($message) use ($users) {
                $message->user = $users->get($message->user_id, ['id' => null, 'username' => 'Unknown User']);
                return $message;
            });

            Log::info('Messages with user data attached', ['count' => $messages->count()]);

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
                'message' => 'required|string|max:1000',
            ]);

            $message = ChatMessage::create([
                'user_id' => $validated['user_id'],
                'message' => $validated['message'],
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

    public function editMessage(Request $request, $id)
    {
        try {
            Log::info('editMessage called', ['message_id' => $id, 'input' => $request->all()]);

            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $message = ChatMessage::findOrFail($id);
            if ($message->user_id !== $user->id || $message->is_admin_reply) {
                Log::error('Unauthorized attempt to edit message', ['user_id' => $user->id, 'message_id' => $id]);
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'message' => 'required|string|max:1000',
            ]);

            $message->update([
                'message' => $validated['message'],
            ]);

            Log::info('Message updated', ['message_id' => $message->id]);

            return response()->json(['message' => 'Message updated', 'data' => $message], 200);
        } catch (\Exception $e) {
            Log::error('Error in editMessage', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['error' => 'Failed to edit message: ' . $e->getMessage()], 500);
        }
    }

    public function deleteMessage(Request $request, $id)
    {
        try {
            Log::info('deleteMessage called', ['message_id' => $id, 'input' => $request->all()]);

            $user = Auth::user();
            if (!$user) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $message = ChatMessage::findOrFail($id);
            if ($message->user_id !== $user->id || $message->is_admin_reply) {
                Log::error('Unauthorized attempt to delete message', ['user_id' => $user->id, 'message_id' => $id]);
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'delete_for' => 'required|in:everyone,user',
            ]);

            $message->update([
                'deleted_for' => $validated['delete_for'],
            ]);

            Log::info('Message deleted', ['message_id' => $message->id, 'deleted_for' => $validated['delete_for']]);

            return response()->json(['message' => 'Message deleted', 'data' => $message], 200);
        } catch (\Exception $e) {
            Log::error('Error in deleteMessage', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['error' => 'Failed to delete message: ' . $e->getMessage()], 500);
        }
    }
}