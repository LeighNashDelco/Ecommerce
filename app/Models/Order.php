<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id', 
        'product_id',
        'order_date',
        'quantity',
        'total_amount',
        'status_id',
        'estimated_delivery_date'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }
}
