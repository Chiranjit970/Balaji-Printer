<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = 'cart_items';

    protected $fillable = [
        'user_id',
        'item_type',
        'product_id',
        'print_job_id',
        'quantity',
    ];

    /**
     * Get the user that owns this cart item.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product details (if item_type = product).
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Get the print job details (if item_type = print).
     */
    public function printJob()
    {
        return $this->belongsTo(PrintJob::class, 'print_job_id');
    }
}
