<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

            $validated = $request->validate([
                'message' => 'required|string|max:1000',
            ]);

            Log::info('Validation passed', ['message' => $validated['message']]);

            $message = ChatMessage::create([
                'user_id' => $user->id,
                'message' => $validated['message'],
                'is_admin_reply' => false,
            ]);

            Log::info('Message created', ['message_id' => $message->id]);

            return response()->json(['message' => 'Question sent', 'data' => $message], 201);
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

            Log::info('User authenticated', ['user_id' => $user->id]);

            $messages = ChatMessage::where('user_id', $user->id)
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

    // app/Http/Controllers/ChatController.php
// app/Http/Controllers/ChatController.php
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

        // Fetch messages without relationship
        $messages = ChatMessage::orderBy('created_at', 'asc')->get();
        Log::info('Messages fetched without user relationship', ['count' => $messages->count()]);

        // Fetch users separately, without loading any relationships
        $userIds = $messages->pluck('user_id')->unique()->toArray();
        $users = \App\Models\User::without(['role', 'profile'])
            ->whereIn('id', $userIds)
            ->select('id', 'username')
            ->get()
            ->keyBy('id');

        Log::info('Users fetched', ['count' => $users->count()]);

        // Attach user data to messages
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
}