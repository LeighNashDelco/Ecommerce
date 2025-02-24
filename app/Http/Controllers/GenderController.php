<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gender; // Ensure Gender model is imported

class GenderController extends Controller
{
    public function index()
    {
        // Fetch all genders from the database
        $genders = Gender::all();
        
        // Return JSON response
        return response()->json($genders, 200);
    }
}
