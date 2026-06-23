<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'read_at',
        'order_id',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    /**
     * Get the user who receives this notification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order associated with this notification (if type = order_update).
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
