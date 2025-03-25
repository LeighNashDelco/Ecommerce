<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'product_reviews';

    protected $fillable = [
        'product_id',
        'user_id', // Changed from profile_id to user_id
        'order_id',
        'rating',
        'comment',
        'photo',
        'archived',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}