<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Models\Gender;
use App\Models\User;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'middlename',
        'last_name',
        'suffix',
        'contact_number',
        'street',
        'city',
        'province',
        'postal_code',
        'country',
        'gender'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'profile_id');
    }

    public function genderRelation()
    {
        return $this->belongsTo(Gender::class, 'gender', 'id');
    }
}    