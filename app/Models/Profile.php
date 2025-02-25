<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'middlename',
        'last_name',
        'gender'
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'profile_id');
    }
}
