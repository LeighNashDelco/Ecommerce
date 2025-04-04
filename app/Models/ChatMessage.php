<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'user_id', 'seller_id', 'message', 'is_admin_reply', 'attachment_path', 'deleted_for', 'read_at'
    ];

    protected $casts = [
        'is_admin_reply' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function seller()
    {
        return $this->belongsTo(Profile::class, 'seller_id');
    }
}