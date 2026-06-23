@extends('admin.layout.app')
@section('title', 'Edit Category')

@section('content')
<div class="max-w-2xl mx-auto">
    <form action="{{ route('admin.categories.update', $category->id) }}" method="POST">
        @csrf
        @method('PUT')

        {{-- Header --}}
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
                <a href="{{ route('admin.categories.index') }}" class="text-slate-500 hover:text-slate-700 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </a>
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Edit Category</h1>
                    <p class="text-sm text-slate-500 mt-1">Modify details for category <strong class="text-slate-800">{{ $category->name }}</strong></p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <a href="{{ route('admin.categories.index') }}" 
                   class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    Cancel
                </a>
                <button type="submit" 
                        class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                    ✦ Save Category
                </button>
            </div>
        </div>

        {{-- Form Card --}}
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            
            {{-- Category Name --}}
            <div>
                <label for="name" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Category Name *</label>
                <input type="text" name="name" id="name" value="{{ old('name', $category->name) }}" placeholder="Enter category name" required
                       class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('name') border-red-300 bg-red-50/20 @enderror">
                @error('name')
                    <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                @enderror
                
                {{-- Slug Preview --}}
                <div class="mt-2 text-xs text-slate-400 font-medium">
                    URL Slug: <span id="slug-preview" class="font-mono text-slate-600 font-semibold">{{ $category->slug }}</span>
                </div>
            </div>

            {{-- Description --}}
            <div>
                <label for="description" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" id="description" rows="3" placeholder="Enter a short description for this category"
                          class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('description') border-red-300 bg-red-50/20 @enderror">{{ old('description', $category->description) }}</textarea>
                @error('description')
                    <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            {{-- Display Order --}}
            <div>
                <label for="display_order" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Display Order</label>
                <input type="number" min="0" name="display_order" id="display_order" value="{{ old('display_order', $category->display_order) }}" placeholder="0"
                       class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('display_order') border-red-300 bg-red-50/20 @enderror">
                <span class="text-[10px] text-slate-400 mt-1 block">Lower numbers appear first in customer menus.</span>
                @error('display_order')
                    <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                @enderror
            </div>

            {{-- Status Checkbox / Switch --}}
            <div class="border-t border-slate-100 pt-4 space-y-4">
                <label class="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $category->is_active) ? 'checked' : '' }}
                           class="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                    <div>
                        <span class="block text-sm font-semibold text-slate-700">Active Category</span>
                        <span class="block text-xs text-slate-500 mt-0.5">Inactive categories are hidden from the store.</span>
                    </div>
                </label>

                <label class="flex items-start gap-3 cursor-pointer border-t border-slate-50 pt-4">
                    <input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $category->is_featured) ? 'checked' : '' }}
                           class="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                    <div>
                        <span class="block text-sm font-semibold text-slate-700">Mark as Featured</span>
                        <span class="block text-xs text-slate-500 mt-0.5">Featured categories appear in highlighted store sections.</span>
                    </div>
                </label>
            </div>

        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const slugPreview = document.getElementById('slug-preview');
    const originalName = "{{ $category->name }}";
    const originalSlug = "{{ $category->slug }}";

    if (nameInput && slugPreview) {
        nameInput.addEventListener('input', function() {
            const val = this.value;
            if (!val) {
                slugPreview.textContent = 'n/a';
                return;
            }
            if (val === originalName) {
                slugPreview.textContent = originalSlug;
                return;
            }
            const slug = val.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            
            slugPreview.textContent = slug;
        });
    }
});
</script>
@endpush
