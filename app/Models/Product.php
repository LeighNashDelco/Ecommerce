<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Specify the table name (optional if it's 'products' by default)
    protected $table = 'products';

    // Define fillable fields to allow mass assignment
    protected $fillable = ['profile_id', 'product_name', 'price', 'description'];

    // Define relationship to Profile model (assuming Profile is linked to users)
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
}
