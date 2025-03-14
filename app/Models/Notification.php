<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['profile_id', 'message', 'faqs_id', 'type', 'status', 'archived'];
    protected $casts = ['archived' => 'boolean'];
}