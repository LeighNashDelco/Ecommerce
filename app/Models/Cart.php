<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['profile_id', 'product_id', 'quantity'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}