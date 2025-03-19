<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function getActiveCategories()
    {
        $activeCategories = Category::where('archived', false)->get();
        return response()->json([
            'active' => $activeCategories
        ]);
    }

    public function getArchivedCategories()
    {
        $archivedCategories = Category::where('archived', true)->get();
        return response()->json([
            'archived' => $archivedCategories
        ]);
    }
}