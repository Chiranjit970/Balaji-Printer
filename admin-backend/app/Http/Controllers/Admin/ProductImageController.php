<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductImageService;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    public function __construct(
        protected ProductImageService $imageService
    ) {}

    // ─────────────────────────────────────────
    // Upload images for existing product
    // ─────────────────────────────────────────
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'images'   => 'required|array',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $currentCount = $product->productImages()->count();

        if ($currentCount >= 5) {
            return back()->with('error',
                'Maximum 5 images allowed. Please remove an image first.');
        }

        $this->imageService->uploadImages(
            $product,
            $request->file('images', [])
        );

        // Sync JSON column for customer API
        $product->fresh()->syncImagesJsonColumn();

        return back()->with('success', 'Image(s) uploaded successfully.');
    }

    // ─────────────────────────────────────────
    // Delete a single image
    // ─────────────────────────────────────────
    public function destroy(ProductImage $image)
    {
        $product = $image->product;

        $this->imageService->deleteImage($image);

        // Sync JSON column for customer API
        $product?->syncImagesJsonColumn();

        return back()->with('success', 'Image removed.');
    }

    // ─────────────────────────────────────────
    // Set image as primary
    // ─────────────────────────────────────────
    public function setPrimary(ProductImage $image)
    {
        $this->imageService->setPrimary($image);

        // Sync JSON — primary image first in array
        $image->product?->syncImagesJsonColumn();

        return back()->with('success', 'Primary image updated.');
    }
}
