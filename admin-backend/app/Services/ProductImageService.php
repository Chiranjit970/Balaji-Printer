<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ProductImageService
{
    private const MAX_IMAGES   = 5;
    private const STORAGE_DISK = 'public';

    // ─────────────────────────────────────────
    // Upload multiple images for a product
    // ─────────────────────────────────────────
    public function uploadImages(Product $product, array $files): void
    {
        $currentCount = $product->productImages()->count();
        $canUpload    = self::MAX_IMAGES - $currentCount;

        if ($canUpload <= 0) {
            return;
        }

        $files = array_slice(
            array_filter($files, fn($f) => $f instanceof UploadedFile),
            0,
            $canUpload
        );

        foreach ($files as $index => $file) {

            $path = $file->store(
                "products/{$product->id}",
                self::STORAGE_DISK
            );

            // First image uploaded = primary if no primary exists
            $hasPrimary = $product->productImages()
                                  ->where('is_primary', true)
                                  ->exists();

            $isPrimary = !$hasPrimary && $index === 0;

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $path,
                'is_primary' => $isPrimary,
                'sort_order' => $currentCount + $index,
            ]);
        }
    }

    // ─────────────────────────────────────────
    // Delete single image
    // ─────────────────────────────────────────
    public function deleteImage(ProductImage $image): void
    {
        $wasPrimary = $image->is_primary;
        $productId  = $image->product_id;

        // Delete file from disk (only if it's a real storage path)
        if (
            !str_starts_with($image->image_path, 'http') &&
            Storage::disk(self::STORAGE_DISK)->exists($image->image_path)
        ) {
            Storage::disk(self::STORAGE_DISK)->delete($image->image_path);
        }

        $image->delete();

        // Promote next image to primary if deleted was primary
        if ($wasPrimary) {
            $next = ProductImage::where('product_id', $productId)
                                ->orderBy('sort_order')
                                ->first();

            $next?->update(['is_primary' => true]);
        }
    }

    // ─────────────────────────────────────────
    // Set primary image
    // ─────────────────────────────────────────
    public function setPrimary(ProductImage $image): void
    {
        // Clear all primaries for this product
        ProductImage::where('product_id', $image->product_id)
                    ->update(['is_primary' => false]);

        $image->update(['is_primary' => true]);
    }
}
