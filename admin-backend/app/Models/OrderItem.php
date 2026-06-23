<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'item_type',
        'print_job_id',
        'product_id',
        'quantity',
        'total_price',
    ];

    /**
     * Get the order that owns this item.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the print job if this item is a print job.
     */
    public function printJob()
    {
        return $this->belongsTo(PrintJob::class, 'print_job_id');
    }

    /**
     * Get the product if this item is a product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
