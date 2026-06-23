<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'shortDescription' => $this->short_description,
            'price' => (float) $this->price,
            'originalPrice' => $this->original_price ? (float) $this->original_price : null,
            'currency' => $this->currency,
            'categoryId' => (string) $this->category_id,
            'categoryName' => $this->category ? $this->category->name : '',
            'images' => $this->images ?: [],
            'rating' => (float) $this->rating,
            'reviewCount' => (int) $this->review_count,
            'features' => $this->features ?: [],
            'specifications' => $this->specifications ?: (object)[],
            'inStock' => (bool) $this->in_stock,
            'stockStatus' => $this->stock_status,
            'stockLabel' => $this->stock_status === 'in_stock' ? 'In Stock · Ready to print' : ($this->stock_status === 'low_stock' ? 'Only a few left' : 'Out of Stock'),
            'isFeatured' => (bool) $this->is_featured,
            'isBestSeller' => (bool) $this->is_best_seller,
            'tags' => $this->tags ?: [],
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
