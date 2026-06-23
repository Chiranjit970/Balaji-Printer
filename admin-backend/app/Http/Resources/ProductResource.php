<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                  => (string) $this->id,
            'categoryId'         => (string) $this->category_id, // preserve camelCase from old code
            'categoryName'       => $this->category ? $this->category->name : '', // preserve field from old code
            'name'                => $this->name,
            'slug'                => $this->slug,
            'description'         => $this->description,
            'shortDescription'   => $this->short_description, // preserve from old code
            'price'               => (float) $this->price,
            'originalPrice'      => $this->original_price ? (float) $this->original_price : null, // preserve from old code
            'currency'            => $this->currency ?: 'INR', // preserve from old code
            'rating'              => (float) $this->rating, // preserve from old code
            'reviewCount'        => (int) $this->review_count, // preserve from old code
            'features'            => $this->features ?: [], // preserve from old code
            'specifications'      => $this->specifications ?: (object)[], // preserve from old code
            'inStock'             => (bool) $this->in_stock, // preserve from old code
            'stockStatus'        => $this->stock_status,
            'stockLabel'         => $this->stock_status === 'in_stock' ? 'In Stock · Ready to print' : ($this->stock_status === 'low_stock' ? 'Only a few left' : 'Out of Stock'), // preserve from old code
            'is_active'           => $this->is_active,
            'isFeatured'         => (bool) $this->is_featured, // preserve from old code
            'isBestSeller'       => (bool) $this->is_best_seller, // preserve from old code
            'is_new_arrival'      => $this->is_new_arrival,
            'is_recommended'      => $this->is_recommended,
            'sku'                 => $this->sku,
            'tags'                => $this->tags ?: [],
            'meta_title'          => $this->meta_title,
            'meta_description'    => $this->meta_description,
            'category'            => $this->whenLoaded('category', fn() => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),

            // ─────────────────────────────────────
            // images: always return clean URL array
            // Compatible with customer mobile app
            // ─────────────────────────────────────
            'images'              => $this->resolveImagesForApi(),

            'createdAt'          => $this->created_at?->toIso8601String(), // preserve from old code
            'updatedAt'          => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Return image URLs whether loaded from:
     * - productImages relationship (preferred)
     * - images JSON column (fallback for backward compat)
     */
    private function resolveImagesForApi(): array
    {
        // Use relationship if loaded
        if ($this->relationLoaded('productImages')) {
            return $this->productImages
                ->sortBy('sort_order')
                ->map(fn($img) => $img->image_url)
                ->values()
                ->toArray();
        }

        // Fall back to JSON column or property
        $images = $this->images ?? [];

        return array_values(array_filter(
            is_array($images) ? $images : []
        ));
    }
}
