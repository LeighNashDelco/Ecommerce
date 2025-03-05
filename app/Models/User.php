<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'first_name',
        'middlename',
        'last_name',
        'gender',
        'suffix',
        'email',
        'password',
        'role_id',
        'archived', // Added archived
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'archived' => 'boolean', // Cast archived as boolean
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id');
    }

    /**
     * Check if the user is active (not archived).
     *
     * @return bool
     */
    public function isActive()
    {
        return !$this->archived;
    }
}