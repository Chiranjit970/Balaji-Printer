<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    // ─────────────────────────────────────────
    // KPI Summary counts
    // ─────────────────────────────────────────
    public function getSummary(): array
    {
        return [
            'total'           => Category::count(),
            'active'          => Category::where('is_active', true)->count(),
            'inactive'        => Category::where('is_active', false)->count(),
            'total_products'  => Product::count(),
        ];
    }

    // ─────────────────────────────────────────
    // Filtered + Paginated Categories
    // ─────────────────────────────────────────
    public function getFilteredCategories(array $filters)
    {
        $query = Category::withCount('products')
                         ->orderBy('display_order')
                         ->orderBy('name');

        // Search name
        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        // Optional status filter
        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('is_active', (bool) $filters['status']);
        }

        $perPage = in_array((int)($filters['per_page'] ?? 10), [10, 20, 50])
            ? (int) ($filters['per_page'] ?? 10)
            : 10;

        return $query->paginate($perPage)->withQueryString();
    }

    // ─────────────────────────────────────────
    // Create Category
    // ─────────────────────────────────────────
    public function createCategory(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            $slug = $this->generateUniqueSlug($data['name']);

            return Category::create([
                'id'            => $slug, // Set string ID as the slug to match seed format
                'name'          => $data['name'],
                'slug'          => $slug,
                'description'   => $data['description'] ?? null,
                'display_order' => $data['display_order'] ?? 0,
                'is_featured'   => $data['is_featured'] ?? false,
                'is_active'     => $data['is_active'] ?? true,
                'icon'          => $data['icon'] ?? 'construct-outline', // default value
                'color'         => $data['color'] ?? '#F0FDF4', // default value
            ]);
        });
    }

    // ─────────────────────────────────────────
    // Update Category
    // ─────────────────────────────────────────
    public function updateCategory(Category $category, array $data): Category
    {
        return DB::transaction(function () use ($category, $data) {
            // Regenerate slug only if name changes
            if ($category->name !== $data['name']) {
                $data['slug'] = $this->generateUniqueSlug($data['name'], $category->id);
            }

            $category->update([
                'name'          => $data['name'],
                'slug'          => $data['slug'] ?? $category->slug,
                'description'   => $data['description'] ?? null,
                'display_order' => $data['display_order'] ?? 0,
                'is_featured'   => $data['is_featured'] ?? false,
                'is_active'     => $data['is_active'] ?? true,
            ]);

            return $category->fresh();
        });
    }

    // ─────────────────────────────────────────
    // Delete Category (with safety check)
    // ─────────────────────────────────────────
    public function deleteCategory(Category $category): array
    {
        $productCount = $category->products()->count();

        if ($productCount > 0) {
            return [
                'type'    => 'error',
                'message' => "Cannot delete \"{$category->name}\". This category contains {$productCount} products."
            ];
        }

        $name = $category->name;
        $category->delete();

        return [
            'type'    => 'success',
            'message' => "Category \"{$name}\" deleted successfully."
        ];
    }

    // ─────────────────────────────────────────
    // Generate unique slug
    // ─────────────────────────────────────────
    private function generateUniqueSlug(string $name, ?string $excludeId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 1;

        while (true) {
            $query = Category::where('slug', $slug);

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
