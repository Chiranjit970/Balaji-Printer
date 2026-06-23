<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'description',
        'short_description',
        'price',
        'original_price',
        'currency',
        'category_id',
        'images',
        'rating',
        'review_count',
        'features',
        'specifications',
        'in_stock',
        'stock_status',
        'is_featured',
        'is_best_seller',
        'tags',
    ];

    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'images' => 'array',
        'rating' => 'float',
        'review_count' => 'integer',
        'features' => 'array',
        'specifications' => 'array',
        'in_stock' => 'boolean',
        'is_featured' => 'boolean',
        'is_best_seller' => 'boolean',
        'tags' => 'array',
    ];

    /**
     * Get the category that this product belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the order items containing this product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the cart items referencing this product.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
