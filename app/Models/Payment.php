<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments'; // Ensure it matches your database table name

    protected $fillable = [
        'order_id',
        'amount',
        'payment_method',
        'transaction_id',
        'payment_date',
    ];

    // Relationship: Each payment belongs to an order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
