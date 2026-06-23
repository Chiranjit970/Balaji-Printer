<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'image_path',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary'  => 'boolean',
        'sort_order'  => 'integer',
    ];

    // ─────────────────────────────────────────
    // Relationship
    // ─────────────────────────────────────────

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ─────────────────────────────────────────
    // Accessor — public URL for this image
    // ─────────────────────────────────────────

    public function getImageUrlAttribute(): string
    {
        // If already a full URL (migrated from old JSON data)
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    // ─────────────────────────────────────────
    // Model events — keep parent JSON in sync
    // ─────────────────────────────────────────

    protected static function booted(): void
    {
        static::saved(function (ProductImage $image) {
            $image->product?->syncImagesJsonColumn();
        });

        static::deleted(function (ProductImage $image) {
            $image->product?->syncImagesJsonColumn();
        });
    }
}
