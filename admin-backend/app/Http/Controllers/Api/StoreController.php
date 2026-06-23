<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;

class StoreController extends Controller
{
    /**
     * Get all categories.
     */
    public function getCategories()
    {
        $categories = Category::all();
        return CategoryResource::collection($categories);
    }

    /**
     * Get products with pagination and filters.
     */
    public function getProducts(Request $request)
    {
        $query = Product::with('category');

        // Filter by Category
        if ($request->has('categoryId') && $request->categoryId !== 'all') {
            $query->where('category_id', $request->categoryId);
        }

        // Search Query
        if ($request->has('q') && !empty($request->q)) {
            $search = strtolower($request->q);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Price Filters
        if ($request->has('minPrice')) {
            $query->where('price', '>=', (float) $request->minPrice);
        }
        if ($request->has('maxPrice')) {
            $query->where('price', '<=', (float) $request->maxPrice);
        }

        // Stock filter
        if ($request->has('inStockOnly') && filter_var($request->inStockOnly, FILTER_VALIDATE_BOOLEAN)) {
            $query->where('in_stock', true);
        }

        // Sorting
        $sortBy = $request->input('sortBy', 'relevance');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popularity':
                $query->orderBy('review_count', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                // relevance - order by featured / best sellers
                $query->orderBy('is_featured', 'desc')->orderBy('is_best_seller', 'desc');
                break;
        }

        $limit = $request->input('limit', 20);
        $paginator = $query->paginate($limit);

        return response()->json([
            'products' => ProductResource::collection($paginator->items()),
            'total' => $paginator->total(),
            'hasMore' => $paginator->hasMorePages()
        ]);
    }

    /**
     * Get single product details.
     */
    public function getProduct($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        return new ProductResource($product);
    }

    /**
     * Get related products in the same category.
     */
    public function getRelatedProducts($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $related = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(6)
            ->get();

        return ProductResource::collection($related);
    }

    /**
     * Get promotional banners.
     */
    public function getBanners()
    {
        // Return active marketing campaigns matching client expectations
        $banners = [
            [
                'id' => 'promo-001',
                'title' => 'Bulk Printing Offers',
                'subtitle' => 'Order 500+ cards and save 30%',
                'ctaText' => 'View Offers',
                'backgroundColor' => '#EFF6FF',
            ],
            [
                'id' => 'promo-002',
                'title' => 'Business Packages',
                'subtitle' => 'Cards + Flyers + Banner combo',
                'ctaText' => 'See Packages',
                'backgroundColor' => '#F0FDF4',
            ]
        ];

        return response()->json($banners);
    }
}
