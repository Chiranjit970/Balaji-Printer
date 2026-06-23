<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    // Match existing string ID format
    public $incrementing = false;
    protected $keyType   = 'string';

    protected $fillable = [
        'id',
        'category_id',
        'name',
        'slug',
        'description',
        'short_description', // preserve existing column
        'price',
        'original_price',
        'currency',          // preserve existing column
        'rating',            // preserve existing column
        'review_count',      // preserve existing column
        'features',          // preserve existing column
        'specifications',    // preserve existing column
        'in_stock',          // preserve existing column
        'stock_status',
        'stock_quantity',
        'low_stock_threshold',
        'is_active',
        'is_featured',
        'is_best_seller',
        'is_new_arrival',
        'is_recommended',
        'sku',
        'tags',
        'images',           // Keep for backward compat with customer API
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'price'               => 'decimal:2',
        'original_price'      => 'decimal:2',
        'rating'              => 'float',
        'review_count'        => 'integer',
        'in_stock'            => 'boolean',
        'stock_quantity'      => 'integer',
        'low_stock_threshold' => 'integer',
        'is_active'           => 'boolean',
        'is_featured'         => 'boolean',
        'is_best_seller'      => 'boolean',
        'is_new_arrival'      => 'boolean',
        'is_recommended'      => 'boolean',
        'tags'                => 'array',
        'images'              => 'array',    // JSON column — customer API compat
        'features'            => 'array',
        'specifications'      => 'array',
    ];

    // ─────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function productImages(): HasMany
    {
        return $this->hasMany(ProductImage::class)
                    ->orderBy('sort_order');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // ─────────────────────────────────────────
    // Sync images JSON column from productImages
    // Called after image changes to keep
    // customer API backward compatible
    // ─────────────────────────────────────────
    public function syncImagesJsonColumn(): void
    {
        $urls = $this->productImages()
                     ->orderBy('sort_order')
                     ->get()
                     ->map(fn($img) => $img->image_url)
                     ->values()
                     ->toArray();

        $this->withoutEvents(function () use ($urls) {
            $this->update(['images' => $urls]);
        });
    }

    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────

    public function getPrimaryImageAttribute(): ?ProductImage
    {
        return $this->productImages
            ->firstWhere('is_primary', true)
            ?? $this->productImages->first();
    }

    public function isReferencedInOrders(): bool
    {
        return OrderItem::where('product_id', $this->id)->exists();
    }
}
