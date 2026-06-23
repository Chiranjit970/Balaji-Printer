<?php

namespace App\Services;

use App\Models\Product;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(
        protected ProductImageService $imageService
    ) {}

    // ─────────────────────────────────────────
    // KPI Summary
    // ─────────────────────────────────────────
    public function getSummary(): array
    {
        return [
            'total'        => Product::count(),
            'active'       => Product::where('is_active', true)->count(),
            'out_of_stock' => Product::where('stock_status', 'out_of_stock')->count(),
            'featured'     => Product::where('is_featured', true)->count(),
        ];
    }

    // ─────────────────────────────────────────
    // Filtered + Paginated Products
    // ─────────────────────────────────────────
    public function getFilteredProducts(array $filters)
    {
        $query = Product::with([
                    'category',
                    'productImages' => fn($q) =>
                        $q->orderBy('sort_order')
                 ])
                 ->latest('updated_at');

        // Search
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(fn($q) =>
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%")
            );
        }

        // Category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Stock status filter
        if (!empty($filters['stock_status'])) {
            $query->where('stock_status', $filters['stock_status']);
        }

        // Featured filter
        if (isset($filters['is_featured']) && $filters['is_featured'] !== '') {
            $query->where('is_featured', (bool) $filters['is_featured']);
        }

        $perPage = in_array((int)($filters['per_page'] ?? 5), [5, 10, 25])
            ? (int) $filters['per_page']
            : 5;

        return $query->paginate($perPage)->withQueryString();
    }

    // ─────────────────────────────────────────
    // Create Product
    // ─────────────────────────────────────────
    public function createProduct(array $data, array $imageFiles = []): Product
    {
        return DB::transaction(function () use ($data, $imageFiles) {

            $product = Product::create([
                'id'                  => $this->generateProductId(),
                'category_id'         => $data['category_id'],
                'name'                => $data['name'],
                'slug'                => $this->generateUniqueSlug($data['name']),
                'description'         => $data['description'],
                'short_description'   => $data['short_description'] ?? substr(strip_tags($data['description']), 0, 100),
                'price'               => $data['price'],
                'original_price'      => $data['original_price'] ?? null,
                'currency'            => 'INR',
                'rating'              => 0.0,
                'review_count'        => 0,
                'in_stock'            => $data['stock_status'] === 'in_stock',
                'stock_status'        => $data['stock_status'],
                'stock_quantity'      => $data['stock_quantity'] ?? 0,
                'low_stock_threshold' => $data['low_stock_threshold'] ?? 5,
                'is_active'           => true,
                'is_featured'         => $data['is_featured'] ?? false,
                'is_best_seller'      => $data['is_best_seller'] ?? false,
                'is_new_arrival'      => $data['is_new_arrival'] ?? false,
                'is_recommended'      => $data['is_recommended'] ?? false,
                'sku'                 => $data['sku'] ?? null,
                'tags'                => $data['tags'] ?? null,
                'meta_title'          => $data['meta_title'] ?? null,
                'meta_description'    => $data['meta_description'] ?? null,
                'images'              => [],
            ]);

            if (!empty($imageFiles)) {
                $this->imageService->uploadImages($product, $imageFiles);
                // Sync JSON column for customer API
                $product->syncImagesJsonColumn();
            }

            return $product->fresh(['category', 'productImages']);
        });
    }

    // ─────────────────────────────────────────
    // Update Product
    // ─────────────────────────────────────────
    public function updateProduct(
        Product $product,
        array $data,
        array $newImageFiles = []
    ): Product {
        return DB::transaction(function () use ($product, $data, $newImageFiles) {

            // Regenerate slug only if name changed
            $slug = $product->name !== $data['name']
                ? $this->generateUniqueSlug($data['name'], $product->id)
                : $product->slug;

            $product->update([
                'category_id'         => $data['category_id'],
                'name'                => $data['name'],
                'slug'                => $slug,
                'description'         => $data['description'],
                'short_description'   => $data['short_description'] ?? $product->short_description,
                'price'               => $data['price'],
                'original_price'      => $data['original_price'] ?? null,
                'in_stock'            => $data['stock_status'] === 'in_stock',
                'stock_status'        => $data['stock_status'],
                'stock_quantity'      => $data['stock_quantity'] ?? 0,
                'low_stock_threshold' => $data['low_stock_threshold'] ?? 5,
                'is_featured'         => $data['is_featured'] ?? false,
                'is_best_seller'      => $data['is_best_seller'] ?? false,
                'is_new_arrival'      => $data['is_new_arrival'] ?? false,
                'is_recommended'      => $data['is_recommended'] ?? false,
                'sku'                 => $data['sku'] ?? null,
                'tags'                => $data['tags'] ?? null,
                'meta_title'          => $data['meta_title'] ?? null,
                'meta_description'    => $data['meta_description'] ?? null,
            ]);

            if (!empty($newImageFiles)) {
                $this->imageService->uploadImages($product, $newImageFiles);
                $product->syncImagesJsonColumn();
            }

            return $product->fresh(['category', 'productImages']);
        });
    }

    // ─────────────────────────────────────────
    // Delete Product (with safety check)
    // ─────────────────────────────────────────
    public function deleteProduct(Product $product): array
    {
        $inOrders = OrderItem::where('product_id', $product->id)->exists();

        if ($inOrders) {
            // Soft delete — never remove order-referenced products
            $product->update(['is_active' => false]);

            return [
                'type'    => 'warning',
                'message' => "Product \"{$product->name}\" was deactivated because it is referenced in existing orders."
            ];
        }

        // Clear cart items
        CartItem::where('product_id', $product->id)->delete();

        // Delete all image files from disk
        $product->load('productImages');
        foreach ($product->productImages as $image) {
            $this->imageService->deleteImage($image);
        }

        $name = $product->name;
        $product->delete();

        return [
            'type'    => 'success',
            'message' => "Product \"{$name}\" was deleted successfully."
        ];
    }

    // ─────────────────────────────────────────
    // Bulk Actions
    // ─────────────────────────────────────────
    public function bulkAction(string $action, array $productIds): array
    {
        $products = Product::whereIn('id', $productIds)->get();
        $count    = $products->count();

        switch ($action) {
            case 'activate':
                Product::whereIn('id', $productIds)
                       ->update(['is_active' => true]);
                $label = 'activated';
                break;

            case 'deactivate':
                Product::whereIn('id', $productIds)
                       ->update(['is_active' => false]);
                $label = 'deactivated';
                break;

            case 'delete':
                foreach ($products as $product) {
                    $this->deleteProduct($product);
                }
                $label = 'processed';
                break;

            default:
                return ['message' => 'Unknown action.'];
        }

        return [
            'message' => "{$count} product(s) {$label} successfully."
        ];
    }

    // ─────────────────────────────────────────
    // Generate unique product ID
    // Matches existing format: prod-XXXX
    // ─────────────────────────────────────────
    private function generateProductId(): string
    {
        do {
            $id = 'prod-' . strtolower(Str::random(8));
        } while (Product::where('id', $id)->exists());

        return $id;
    }

    // ─────────────────────────────────────────
    // Generate unique slug
    // ─────────────────────────────────────────
    private function generateUniqueSlug(string $name, ?string $excludeId = null): string
    {
        $base    = Str::slug($name);
        $slug    = $base;
        $counter = 1;

        while (true) {
            $query = Product::where('slug', $slug);

            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }

            if (!$query->exists()) {
                return $slug;
            }

            $slug = $base . '-' . $counter++;
        }
    }
}
