<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    // ─────────────────────────────────────────
    // 4.1 Products List
    // ─────────────────────────────────────────
    public function index(Request $request)
    {
        $filters = $request->only([
            'search', 'category_id', 'stock_status', 'is_featured', 'per_page'
        ]);

        $products   = $this->productService->getFilteredProducts($filters);
        $categories = Category::orderBy('name')->get();
        $summary    = $this->productService->getSummary();

        return view('admin.products.index',
            compact('products', 'categories', 'summary', 'filters'));
    }

    // ─────────────────────────────────────────
    // Create Form
    // ─────────────────────────────────────────
    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return view('admin.products.create', compact('categories'));
    }

    // ─────────────────────────────────────────
    // Store New Product
    // ─────────────────────────────────────────
    public function store(ProductRequest $request)
    {
        $product = $this->productService->createProduct(
            $request->validated(),
            $request->file('images', [])
        );

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" created successfully.");
    }

    // ─────────────────────────────────────────
    // Edit Form
    // ─────────────────────────────────────────
    public function edit(Product $product)
    {
        $product->load(['productImages' => fn($q) => $q->orderBy('sort_order'),
                        'category']);

        $categories = Category::orderBy('name')->get();

        return view('admin.products.edit',
            compact('product', 'categories'));
    }

    // ─────────────────────────────────────────
    // Update Product
    // ─────────────────────────────────────────
    public function update(ProductRequest $request, Product $product)
    {
        $this->productService->updateProduct(
            $product,
            $request->validated(),
            $request->file('images', [])
        );

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" updated successfully.");
    }

    // ─────────────────────────────────────────
    // Delete Product
    // ─────────────────────────────────────────
    public function destroy(Product $product)
    {
        $result = $this->productService->deleteProduct($product);

        return redirect()
            ->route('admin.products.index')
            ->with($result['type'], $result['message']);
    }

    // ─────────────────────────────────────────
    // Toggle Active Status
    // ─────────────────────────────────────────
    public function toggleActive(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);

        $label = $product->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Product {$label}.");
    }

    // ─────────────────────────────────────────
    // Toggle Featured Status
    // ─────────────────────────────────────────
    public function toggleFeatured(Product $product)
    {
        $product->update(['is_featured' => !$product->is_featured]);

        return back()->with('success', 'Featured status updated.');
    }

    // ─────────────────────────────────────────
    // Bulk Actions
    // ─────────────────────────────────────────
    public function bulk(Request $request)
    {
        $request->validate([
            'action'        => 'required|in:activate,deactivate,delete',
            'product_ids'   => 'required|array|min:1',
            'product_ids.*' => 'string|exists:products,id',
        ]);

        $result = $this->productService->bulkAction(
            $request->action,
            $request->product_ids
        );

        return back()->with('success', $result['message']);
    }
}
