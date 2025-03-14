<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'product_reviews'; // Use product_reviews table
    protected $fillable = ['product_id', 'profile_id', 'rating', 'comment', 'archived'];
    protected $casts = ['archived' => 'boolean'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}