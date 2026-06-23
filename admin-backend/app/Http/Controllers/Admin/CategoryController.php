<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    // ─────────────────────────────────────────
    // 5.1 Category List Page
    // ─────────────────────────────────────────
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'per_page']);

        $categories = $this->categoryService->getFilteredCategories($filters);
        $summary    = $this->categoryService->getSummary();

        return view('admin.categories.index', compact('categories', 'summary', 'filters'));
    }

    // ─────────────────────────────────────────
    // Create Form
    // ─────────────────────────────────────────
    public function create()
    {
        return view('admin.categories.create');
    }

    // ─────────────────────────────────────────
    // Store New Category
    // ─────────────────────────────────────────
    public function store(CategoryRequest $request)
    {
        $category = $this->categoryService->createCategory($request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', "Category \"{$category->name}\" created successfully.");
    }

    // ─────────────────────────────────────────
    // Edit Form
    // ─────────────────────────────────────────
    public function edit(Category $category)
    {
        return view('admin.categories.edit', compact('category'));
    }

    // ─────────────────────────────────────────
    // Update Category
    // ─────────────────────────────────────────
    public function update(CategoryRequest $request, Category $category)
    {
        $this->categoryService->updateCategory($category, $request->validated());

        return redirect()
            ->route('admin.categories.index')
            ->with('success', "Category \"{$category->name}\" updated successfully.");
    }

    // ─────────────────────────────────────────
    // Delete Category
    // ─────────────────────────────────────────
    public function destroy(Category $category)
    {
        $result = $this->categoryService->deleteCategory($category);

        return redirect()
            ->route('admin.categories.index')
            ->with($result['type'], $result['message']);
    }

    // ─────────────────────────────────────────
    // Toggle Active Status
    // ─────────────────────────────────────────
    public function toggleActive(Category $category)
    {
        $category->update(['is_active' => !$category->is_active]);

        $label = $category->is_active ? 'activated' : 'deactivated';
        $type = $category->is_active ? 'success' : 'warning';

        return back()->with($type, "Category \"{$category->name}\" was {$label}.");
    }

    // ─────────────────────────────────────────
    // Toggle Featured Status
    // ─────────────────────────────────────────
    public function toggleFeatured(Category $category)
    {
        $category->update(['is_featured' => !$category->is_featured]);

        $label = $category->is_featured ? 'marked as featured' : 'removed from featured';

        return back()->with('success', "Category \"{$category->name}\" is now {$label}.");
    }
}
