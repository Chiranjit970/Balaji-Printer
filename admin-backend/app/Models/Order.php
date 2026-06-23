<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'display_order_id',
        'user_id',
        'address_id',
        'order_status',
        'payment_status',
        'subtotal',
        'print_jobs_total',
        'products_total',
        'delivery_charges',
        'tax',
        'total_amount',
        'payment_method',
        'razorpay_payment_id',
        'razorpay_order_id',
        'estimated_delivery',
        'cancellation_reason',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'print_jobs_total' => 'float',
        'products_total' => 'float',
        'delivery_charges' => 'float',
        'tax' => 'float',
        'total_amount' => 'float',
        'estimated_delivery' => 'datetime',
    ];

    /**
     * Get the user who placed this order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the delivery address of the order.
     */
    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    /**
     * Get the payment associated with the order.
     */
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Get the items in the order.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the notifications associated with this order.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
