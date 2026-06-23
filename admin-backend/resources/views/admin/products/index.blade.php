@extends('admin.layout.app')
@section('title', 'Products')

@section('content')
<div x-data="{ selectedIds: [], bulkAction: '' }">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Products</h1>
            <p class="text-sm text-slate-500 mt-1">Manage your store product catalog.</p>
        </div>
        <a href="{{ route('admin.products.create') }}"
           class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Product
        </a>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        @foreach([
            ['label' => 'Total Products',  'value' => $summary['total'],        'color' => 'text-slate-900', 'bg' => 'bg-white'],
            ['label' => 'Active Products', 'value' => $summary['active'],       'color' => 'text-green-600', 'bg' => 'bg-white'],
            ['label' => 'Out of Stock',    'value' => $summary['out_of_stock'], 'color' => 'text-red-600',   'bg' => 'bg-white'],
            ['label' => 'Featured',        'value' => $summary['featured'],     'color' => 'text-blue-600',  'bg' => 'bg-white'],
        ] as $kpi)
            <div class="{{ $kpi['bg'] }} border border-slate-200 rounded-xl p-4 shadow-sm">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ $kpi['label'] }}</p>
                <p class="text-2xl font-bold {{ $kpi['color'] }} mt-2">{{ $kpi['value'] }}</p>
            </div>
        @endforeach
    </div>

    {{-- Filters --}}
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
        <form method="GET" action="{{ route('admin.products.index') }}" class="flex flex-col md:flex-row items-stretch md:items-end gap-3">
            <div class="flex-1">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Search</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </span>
                    <input type="text" name="search" value="{{ $filters['search'] ?? '' }}" placeholder="Search by product name or SKU..."
                           class="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                </div>
            </div>

            <div class="w-full md:w-48">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                <select name="category_id" class="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    <option value="">All Categories</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}" {{ ($filters['category_id'] ?? '') === $cat->id ? 'selected' : '' }}>
                            {{ $cat->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="w-full md:w-44">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Stock Status</label>
                <select name="stock_status" class="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    <option value="">All Statuses</option>
                    <option value="in_stock" {{ ($filters['stock_status'] ?? '') === 'in_stock' ? 'selected' : '' }}>In Stock</option>
                    <option value="out_of_stock" {{ ($filters['stock_status'] ?? '') === 'out_of_stock' ? 'selected' : '' }}>Out of Stock</option>
                    <option value="pre_order" {{ ($filters['stock_status'] ?? '') === 'pre_order' ? 'selected' : '' }}>Pre Order</option>
                </select>
            </div>

            <div class="flex items-center gap-2">
                <a href="{{ route('admin.products.index') }}" class="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center flex-1 md:flex-none">
                    Reset
                </a>
                <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors text-center flex-1 md:flex-none">
                    Filter
                </button>
            </div>
        </form>
    </div>

    {{-- Bulk Action Bar --}}
    @include('admin.components.bulk-action-bar', ['actionRoute' => route('admin.products.bulk')])

    {{-- Catalog Grid / Table --}}
    @if($products->isEmpty())
        <div class="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <div class="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
            </div>
            <h3 class="text-base font-semibold text-slate-900">No products found</h3>
            <p class="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Try adjusting your filters or add a new product to get started.</p>
            <div class="mt-5">
                <a href="{{ route('admin.products.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Product
                </a>
            </div>
        </div>
    @else
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th class="py-3 px-4 w-10">
                                <input type="checkbox" 
                                       @change="if($el.checked) { selectedIds = [ @foreach($products as $p)'{{ $p->id }}',@endforeach ] } else { selectedIds = [] }"
                                       class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                            </th>
                            <th class="py-3 px-4 w-16">Image</th>
                            <th class="py-3 px-4">Product Name</th>
                            <th class="py-3 px-4">Category</th>
                            <th class="py-3 px-4">Price</th>
                            <th class="py-3 px-4">Stock Status</th>
                            <th class="py-3 px-4">Updated At</th>
                            <th class="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                        @foreach($products as $product)
                            <tr class="hover:bg-slate-50/50 transition-colors {{ !$product->is_active ? 'opacity-65' : '' }}">
                                <td class="py-3 px-4">
                                    <input type="checkbox" 
                                           value="{{ $product->id }}" 
                                           x-model="selectedIds"
                                           class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                                </td>
                                <td class="py-3 px-4">
                                    <div class="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                        @if($product->primary_image)
                                            <img src="{{ $product->primary_image->image_url }}" alt="" class="w-full h-full object-cover">
                                        @else
                                            <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        @endif
                                    </div>
                                </td>
                                <td class="py-3 px-4">
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-slate-900">{{ $product->name }}</span>
                                        @if($product->sku)
                                            <span class="text-xs text-slate-400 mt-0.5">SKU: {{ $product->sku }}</span>
                                        @endif
                                        @include('admin.components.product-flag-badge', ['product' => $product])
                                    </div>
                                </td>
                                <td class="py-3 px-4 text-blue-600 font-medium">
                                    {{ $product->category->name ?? 'Uncategorized' }}
                                </td>
                                <td class="py-3 px-4">
                                    <div class="flex items-center gap-1.5 font-semibold text-slate-900">
                                        <span>₹{{ number_format($product->price, 2) }}</span>
                                        @if($product->original_price)
                                            <span class="text-xs font-normal text-slate-400 line-through">₹{{ number_format($product->original_price, 2) }}</span>
                                        @endif
                                    </div>
                                </td>
                                <td class="py-3 px-4">
                                    @include('admin.components.stock-badge', ['status' => $product->stock_status])
                                </td>
                                <td class="py-3 px-4 text-slate-500">
                                    {{ $product->updated_at?->format('M d, Y h:i A') }}
                                </td>
                                <td class="py-3 px-4 text-right">
                                    <div class="flex items-center justify-end gap-3">
                                        {{-- Toggle Active Quick Link --}}
                                        <form action="{{ route('admin.products.toggleActive', $product->id) }}" method="POST" class="inline">
                                            @csrf
                                            @method('PATCH')
                                            <button type="submit" class="text-xs font-semibold {{ $product->is_active ? 'text-slate-400 hover:text-slate-600' : 'text-green-600 hover:text-green-800' }}">
                                                {{ $product->is_active ? 'Deactivate' : 'Activate' }}
                                            </button>
                                        </form>

                                        <a href="{{ route('admin.products.edit', $product->id) }}" class="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                            </svg>
                                            Edit
                                        </a>
                                        
                                        <button type="button" 
                                                @click="$dispatch('open-delete-modal', { 
                                                    url: '{{ route('admin.products.destroy', $product->id) }}', 
                                                    name: '{{ addslashes($product->name) }}',
                                                    referenced: {{ $product->isReferencedInOrders() ? 'true' : 'false' }}
                                                })"
                                                class="text-red-600 hover:text-red-800 font-semibold inline-flex items-center gap-1">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            {{-- Footer Pagination --}}
            <div class="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div>
                    Showing {{ $products->firstItem() }} to {{ $products->lastItem() }} of {{ $products->total() }} products
                </div>
                
                <div class="flex items-center gap-4">
                    {{-- Per Page Selector --}}
                    <form method="GET" action="{{ route('admin.products.index') }}" class="flex items-center gap-1.5">
                        @if(request('search')) <input type="hidden" name="search" value="{{ request('search') }}"> @endif
                        @if(request('category_id')) <input type="hidden" name="category_id" value="{{ request('category_id') }}"> @endif
                        @if(request('stock_status')) <input type="hidden" name="stock_status" value="{{ request('stock_status') }}"> @endif
                        
                        <span>Show</span>
                        <select name="per_page" onchange="this.form.submit()" class="py-1 px-2 border border-slate-200 rounded bg-white text-xs font-semibold focus:outline-none focus:border-blue-600 transition-colors">
                            <option value="5" {{ ($filters['per_page'] ?? 5) == 5 ? 'selected' : '' }}>5</option>
                            <option value="10" {{ ($filters['per_page'] ?? 5) == 10 ? 'selected' : '' }}>10</option>
                            <option value="25" {{ ($filters['per_page'] ?? 5) == 25 ? 'selected' : '' }}>25</option>
                        </select>
                        <span>per page</span>
                    </form>

                    {{-- Nav links --}}
                    <div>
                        {{ $products->links() }}
                    </div>
                </div>
            </div>
        </div>
    @endif

    {{-- Include Confirmation Delete Modal --}}
    @include('admin.components.delete-confirm-modal')
</div>
@endsection
