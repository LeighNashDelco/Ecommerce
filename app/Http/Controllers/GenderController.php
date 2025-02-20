<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GenderController extends Controller
{
    public function getGenders()
    {
        return response()->json(DB::table('genders')->get());
    }
}
