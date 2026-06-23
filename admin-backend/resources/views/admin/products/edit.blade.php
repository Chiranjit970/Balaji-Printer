@extends('admin.layout.app')
@section('title', 'Edit Product')

@section('content')
<form action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')

    {{-- Header --}}
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
            <a href="{{ route('admin.products.index') }}" class="text-slate-500 hover:text-slate-700 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Edit Product</h1>
                <p class="text-sm text-slate-500 mt-1">Modify details for <strong class="text-slate-800">{{ $product->name }}</strong></p>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <a href="{{ route('admin.products.index') }}" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
            </a>
            <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                ✦ Save Product
            </button>
        </div>
    </div>

    {{-- Flash messages inside edit too --}}
    @foreach(['success' => 'green', 'warning' => 'amber', 'error' => 'red'] as $type => $color)
        @if(session($type))
        <div class="mb-4 p-3 bg-{{ $color }}-50 border border-{{ $color }}-200
                    text-{{ $color }}-700 rounded-lg text-sm">
            {{ session($type) }}
        </div>
        @endif
    @endforeach

    {{-- Error Summary --}}
    @if($errors->any())
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <h5 class="font-semibold mb-2">Please fix the following validation errors:</h5>
            <ul class="list-disc pl-5 space-y-1">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Layout Grid --}}
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {{-- Left Column (60%) --}}
        <div class="lg:col-span-3 space-y-6">
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
                <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h2>

                {{-- Product Name --}}
                <div>
                    <label for="name" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Product Name *</label>
                    <input type="text" name="name" id="name" value="{{ old('name', $product->name) }}" placeholder="Enter product name"
                           class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('name') border-red-300 bg-red-50/20 @enderror">
                    @error('name')
                        <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                    @enderror
                    
                    {{-- Slug Preview --}}
                    <div class="mt-1.5 text-xs text-slate-400 font-medium">
                        Slug URL: <span id="slug-preview" class="font-semibold text-slate-600">{{ $product->slug }}</span>
                    </div>
                </div>

                {{-- Description --}}
                <div>
                    <label for="description" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Description *</label>
                    <textarea name="description" id="description" rows="5" placeholder="Enter product description..."
                              class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('description') border-red-300 bg-red-50/20 @enderror">{{ old('description', $product->description) }}</textarea>
                    @error('description')
                        <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Price & Original Price --}}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="price" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Price (₹) *</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                            <input type="number" step="0.01" min="0" name="price" id="price" value="{{ old('price', $product->price) }}" placeholder="0.00"
                                   class="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('price') border-red-300 bg-red-50/20 @enderror">
                        </div>
                        @error('price')
                            <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="original_price" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Original Price (₹)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                            <input type="number" step="0.01" min="0" name="original_price" id="original_price" value="{{ old('original_price', $product->original_price) }}" placeholder="0.00 (optional)"
                                   class="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600">
                        </div>
                        <span class="text-[10px] text-slate-400 mt-1 block leading-normal">Used to show discounts. Leave empty or 0 if no discount.</span>
                        
                        {{-- Live Discount Percentage --}}
                        <span id="discount-badge" class="inline-flex items-center mt-1.5 px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 rounded hidden">
                            0% OFF
                        </span>
                    </div>
                </div>

                {{-- Category & Stock Status --}}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="category_id" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Category *</label>
                        <select name="category_id" id="category_id" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('category_id') border-red-300 bg-red-50/20 @enderror">
                            <option value="">Select Category</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}" {{ old('category_id', $product->category_id) === $cat->id ? 'selected' : '' }}>
                                    {{ $cat->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('category_id')
                            <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="stock_status" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Stock Status *</label>
                        <select name="stock_status" id="stock_status" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600">
                            <option value="in_stock" {{ old('stock_status', $product->stock_status) === 'in_stock' ? 'selected' : '' }}>In Stock</option>
                            <option value="out_of_stock" {{ old('stock_status', $product->stock_status) === 'out_of_stock' ? 'selected' : '' }}>Out of Stock</option>
                            <option value="pre_order" {{ old('stock_status', $product->stock_status) === 'pre_order' ? 'selected' : '' }}>Pre Order</option>
                        </select>
                        @error('stock_status')
                            <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                {{-- Stock Quantity & SKU --}}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="stock_quantity" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Stock Quantity</label>
                        <input type="number" min="0" name="stock_quantity" id="stock_quantity" value="{{ old('stock_quantity', $product->stock_quantity) }}" placeholder="0"
                               class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600">
                        @error('stock_quantity')
                            <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="sku" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">SKU</label>
                        <input type="text" name="sku" id="sku" value="{{ old('sku', $product->sku) }}" placeholder="Optional product code"
                               class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 @error('sku') border-red-300 bg-red-50/20 @enderror">
                        @error('sku')
                            <p class="text-xs text-red-600 mt-1">{{ $message }}</p>
                        @enderror
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column (40%) --}}
        <div class="lg:col-span-2 space-y-6">
            
            {{-- Image Uploads --}}
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Product Images</h2>
                
                @include('admin.components.image-upload-grid', ['product' => $product])

                <div class="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-3 leading-relaxed space-y-1">
                    <p class="font-semibold text-slate-700">Image Guidelines:</p>
                    <p>• Allowed formats: JPG, PNG</p>
                    <p>• Maximum size: 2MB per image</p>
                    <p>• Maximum 5 images allowed</p>
                    <p>• Manage primary status and deletion directly via overlays</p>
                </div>
            </div>

            {{-- Product Flags --}}
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Product Promotion Flags</h2>
                
                <div class="space-y-3">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $product->is_featured) ? 'checked' : '' }}
                               class="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                        <div>
                            <span class="block text-sm font-semibold text-slate-700">Featured Product</span>
                            <span class="block text-xs text-slate-500 mt-0.5">Show in Featured sections on the client store app home page</span>
                        </div>
                    </label>

                    <label class="flex items-start gap-3 cursor-pointer border-t border-slate-50 pt-3">
                        <input type="checkbox" name="is_best_seller" value="1" {{ old('is_best_seller', $product->is_best_seller) ? 'checked' : '' }}
                               class="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                        <div>
                            <span class="block text-sm font-semibold text-slate-700">Best Seller</span>
                            <span class="block text-xs text-slate-500 mt-0.5">Show in Best Sellers section</span>
                        </div>
                    </label>

                    <label class="flex items-start gap-3 cursor-pointer border-t border-slate-50 pt-3">
                        <input type="checkbox" name="is_new_arrival" value="1" {{ old('is_new_arrival', $product->is_new_arrival) ? 'checked' : '' }}
                               class="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                        <div>
                            <span class="block text-sm font-semibold text-slate-700">New Arrival</span>
                            <span class="block text-xs text-slate-500 mt-0.5">Show in New Arrivals section</span>
                        </div>
                    </label>

                    <label class="flex items-start gap-3 cursor-pointer border-t border-slate-50 pt-3">
                        <input type="checkbox" name="is_recommended" value="1" {{ old('is_recommended', $product->is_recommended) ? 'checked' : '' }}
                               class="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                        <div>
                            <span class="block text-sm font-semibold text-slate-700">Recommended</span>
                            <span class="block text-xs text-slate-500 mt-0.5">Show in Recommended section</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const slugPreview = document.getElementById('slug-preview');
    const priceInput = document.getElementById('price');
    const originalPriceInput = document.getElementById('original_price');
    const discountBadge = document.getElementById('discount-badge');

    // Auto-generate slug preview from product name
    if(nameInput && slugPreview) {
        nameInput.addEventListener('input', function() {
            const val = this.value;
            if(!val) {
                slugPreview.textContent = 'n/a';
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

    // Dynamic Discount Calculator
    function calculateDiscount() {
        const price = parseFloat(priceInput.value) || 0;
        const originalPrice = parseFloat(originalPriceInput.value) || 0;

        if (originalPrice > price && price > 0) {
            const diff = originalPrice - price;
            const pct = Math.round((diff / originalPrice) * 100);
            discountBadge.textContent = pct + '% OFF';
            discountBadge.classList.remove('hidden');
        } else {
            discountBadge.classList.add('hidden');
        }
    }

    if(priceInput && originalPriceInput) {
        priceInput.addEventListener('input', calculateDiscount);
        originalPriceInput.addEventListener('input', calculateDiscount);
        calculateDiscount(); // Trigger on load
    }
});
</script>
@endpush
