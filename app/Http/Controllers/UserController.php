<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Profile;
use App\Models\Gender;

class UserController extends Controller
{
    public function getUserProfile(Request $request)
    {
        // Ensure the user is authenticated
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch profile with gender name using Eloquent relationship
        $profile = Profile::where('user_id', $user->id)
            ->with('genderRelation') // Ensure relationship is loaded
            ->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        // Ensure full image URL
        $profileImgPath = $profile->profile_img
            ? asset($profile->profile_img)
            : asset('images/pfp/default.png');

        return response()->json([
            'user' => [
                'id'       => $user->id,
                'username' => $user->username,
                'email'    => $user->email,
            ],
            'profile' => [
                'first_name'      => $profile->first_name,
                'middlename'      => $profile->middlename,
                'last_name'       => $profile->last_name,
                'gender'          => $profile->genderRelation ? $profile->genderRelation->name : "Unknown",
                'suffix'          => $profile->suffix,
                'contact_number'  => $profile->contact_number,
                'street'          => $profile->street,
                'city'            => $profile->city,
                'province'        => $profile->province,
                'postal_code'     => $profile->postal_code,
                'country'         => $profile->country,
                'profile_img'     => $profileImgPath,
            ],
        ]);
    }
    public function updateUserProfile(Request $request)
    {
        if (!Auth::guard('api')->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $user = Auth::guard('api')->user();
        $profile = Profile::where('user_id', $user->id)->first();
    
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
    
        // Validate incoming data
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|string|exists:genders,name', // Validate gender by name
            'suffix' => 'nullable|string|max:10',
            'contact_number' => 'nullable|string|max:15',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'country' => 'nullable|string|max:255',
        ]);
    
        // Fetch gender ID based on name
        $gender = Gender::where('name', $validatedData['gender'])->first();
        if (!$gender) {
            return response()->json(['message' => 'Invalid gender selection'], 400);
        }
    
        // Update the profile with the correct gender ID
        $profile->update([
            'first_name' => $validatedData['first_name'],
            'middlename' => $validatedData['middlename'] ?? null,
            'last_name' => $validatedData['last_name'],
            'gender' => $gender->id, // Store gender ID instead of name
            'suffix' => $validatedData['suffix'] ?? null,
            'contact_number' => $validatedData['contact_number'] ?? null,
            'street' => $validatedData['street'] ?? null,
            'city' => $validatedData['city'] ?? null,
            'province' => $validatedData['province'] ?? null,
            'postal_code' => $validatedData['postal_code'] ?? null,
            'country' => $validatedData['country'] ?? null,
        ]);
    
        return response()->json(['message' => 'Profile updated successfully!'], 200);
    }
}    