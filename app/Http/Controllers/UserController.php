<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Profile;
use App\Models\Gender;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Get the authenticated user's profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserProfile(Request $request)
    {
        try {
            $user = Auth::guard('api')->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $profile = Profile::where('user_id', $user->id)
                ->with('genderRelation')
                ->first();

            if (!$profile) {
                return response()->json(['message' => 'Profile not found'], 404);
            }

            // Use 'images/pfp/default.png' as default if profile_img is null or empty
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
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching user profile: ' . $e->getMessage());
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    /**
     * Update the authenticated user's profile, including profile image.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUserProfile(Request $request)
    {
        try {
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
                'first_name' => 'sometimes|required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'gender' => 'sometimes|required|string|exists:genders,name',
                'suffix' => 'nullable|string|max:10',
                'contact_number' => 'nullable|string|max:15',
                'street' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'province' => 'nullable|string|max:255',
                'postal_code' => 'nullable|string|max:10',
                'country' => 'nullable|string|max:255',
                'profile_img' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
                'password' => 'sometimes|required|string|min:8',
            ]);

            // Handle profile image upload
            if ($request->hasFile('profile_img')) {
                $file = $request->file('profile_img');
                $filename = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
                $destinationPath = public_path('img/pfp'); // Still saving to img/pfp

                // Ensure the directory exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                // Check if directory is writable
                if (!is_writable($destinationPath)) {
                    Log::error("Directory not writable: " . $destinationPath);
                    return response()->json(['message' => 'Server error: Image directory not writable'], 500);
                }

                // Delete old image if exists
                if ($profile->profile_img && file_exists(public_path($profile->profile_img))) {
                    unlink(public_path($profile->profile_img));
                }

                // Move new image to public/img/pfp
                $file->move($destinationPath, $filename);
                $profile->profile_img = 'img/pfp/' . $filename;
            }

            // Update profile fields if provided
            $fields = ['first_name', 'middlename', 'last_name', 'suffix', 'contact_number', 'street', 'city', 'province', 'postal_code', 'country'];
            foreach ($fields as $field) {
                if ($request->has($field)) {
                    $profile->$field = $validatedData[$field] ?? null;
                }
            }

            if ($request->has('gender')) {
                $gender = Gender::where('name', $validatedData['gender'])->first();
                if (!$gender) {
                    return response()->json(['message' => 'Invalid gender selection'], 400);
                }
                $profile->gender = $gender->id;
            }

            // Update password if provided
            if ($request->has('password')) {
                $user->password = Hash::make($validatedData['password']);
                $user->save();
            }

            $profile->save();

            // Prepare response with default image if no profile_img
            $profileImgPath = $profile->profile_img
                ? asset($profile->profile_img)
                : asset('images/pfp/default.png');

            return response()->json([
                'message' => 'Profile updated successfully',
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
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating profile: ' . $e->getMessage());
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}