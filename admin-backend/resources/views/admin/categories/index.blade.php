@extends('admin.layout.app')
@section('title', 'Categories')

@section('content')
<div>
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Categories</h1>
            <p class="text-sm text-slate-500 mt-1">Manage product categories to organize your store.</p>
        </div>
        <a href="{{ route('admin.categories.create') }}"
           class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Category
        </a>
    </div>

    {{-- Flash Messages --}}
    @foreach(['success' => 'green', 'warning' => 'amber', 'error' => 'red'] as $type => $color)
        @if(session($type))
        <div class="mb-4 p-3 bg-{{ $color }}-50 border border-{{ $color }}-200 text-{{ $color }}-700 rounded-lg text-sm flex items-center justify-between">
            <span>{{ session($type) }}</span>
            <button onclick="this.parentElement.remove()" class="text-{{ $color }}-500 hover:text-{{ $color }}-800 font-bold text-sm ml-2">&times;</button>
        </div>
        @endif
    @endforeach

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        @foreach([
            ['label' => 'Total Categories',    'value' => $summary['total'],           'color' => 'text-slate-900'],
            ['label' => 'Active Categories',   'value' => $summary['active'],          'color' => 'text-green-600'],
            ['label' => 'Inactive Categories', 'value' => $summary['inactive'],        'color' => 'text-slate-500'],
            ['label' => 'Total Products',      'value' => $summary['total_products'],  'color' => 'text-blue-600'],
        ] as $kpi)
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ $kpi['label'] }}</p>
                <p class="text-2xl font-bold {{ $kpi['color'] }} mt-2">{{ $kpi['value'] }}</p>
            </div>
        @endforeach
    </div>

    {{-- Filters --}}
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
        <form method="GET" action="{{ route('admin.categories.index') }}" class="flex flex-col md:flex-row items-stretch md:items-end gap-3">
            <div class="flex-1">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Search</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </span>
                    <input type="text" name="search" value="{{ $filters['search'] ?? '' }}" placeholder="Search by category name..."
                           class="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                </div>
            </div>

            <div class="w-full md:w-44">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" class="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    <option value="">All Statuses</option>
                    <option value="1" {{ ($filters['status'] ?? '') === '1' ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ ($filters['status'] ?? '') === '0' ? 'selected' : '' }}>Inactive</option>
                </select>
            </div>

            <div class="flex items-center gap-2">
                <a href="{{ route('admin.categories.index') }}" class="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center flex-1 md:flex-none">
                    Reset
                </a>
                <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors text-center flex-1 md:flex-none">
                    Filter
                </button>
            </div>
        </form>
    </div>

    {{-- Category Table --}}
    @if($categories->isEmpty())
        <div class="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <div class="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
            </div>
            <h3 class="text-base font-semibold text-slate-900">No categories found</h3>
            <p class="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Create your first category to organize your products.</p>
            <div class="mt-5">
                <a href="{{ route('admin.categories.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Category
                </a>
            </div>
        </div>
    @else
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th class="py-3 px-4 w-12 text-center">#</th>
                            <th class="py-3 px-4">Category Name</th>
                            <th class="py-3 px-4 w-40 text-center">Products Count</th>
                            <th class="py-3 px-4">Created At</th>
                            <th class="py-3 px-4">Updated At</th>
                            <th class="py-3 px-4 text-right w-28">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                        @foreach($categories as $category)
                            <tr class="hover:bg-slate-50/50 transition-colors {{ !$category->is_active ? 'opacity-65' : '' }}">
                                <td class="py-3 px-4 text-center text-slate-400 font-semibold">
                                    {{ ($categories->currentPage() - 1) * $categories->perPage() + $loop->iteration }}
                                </td>
                                <td class="py-3 px-4">
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-slate-900">{{ $category->name }}</span>
                                        <span class="text-xs text-slate-400 font-mono mt-0.5">Slug: {{ $category->slug }}</span>
                                        
                                        {{-- Badges Row --}}
                                        <div class="flex flex-wrap gap-1 mt-1.5">
                                            @if($category->is_active)
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                                    Active
                                                </span>
                                            @else
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    Inactive
                                                </span>
                                            @endif
                                            
                                            @if($category->is_featured)
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                    Featured
                                                </span>
                                            @endif
                                            
                                            @if($category->display_order > 0)
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                                    Order: {{ $category->display_order }}
                                                </span>
                                            @endif
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3 px-4 text-center font-semibold text-slate-900">
                                    {{ $category->products_count }}
                                </td>
                                <td class="py-3 px-4 text-slate-500">
                                    {{ $category->created_at?->format('M d, Y h:i A') }}
                                </td>
                                <td class="py-3 px-4 text-slate-500">
                                    {{ $category->updated_at?->format('M d, Y h:i A') }}
                                </td>
                                <td class="py-3 px-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        {{-- Toggle Status Quick Actions --}}
                                        <form action="{{ route('admin.categories.toggleActive', $category->id) }}" method="POST" class="inline">
                                            @csrf
                                            @method('PATCH')
                                            <button type="submit" class="text-xs font-semibold {{ $category->is_active ? 'text-slate-400 hover:text-slate-600' : 'text-green-600 hover:text-green-800' }}">
                                                {{ $category->is_active ? 'Disable' : 'Enable' }}
                                            </button>
                                        </form>

                                        {{-- Square Edit Icon Button --}}
                                        <a href="{{ route('admin.categories.edit', $category->id) }}" 
                                           class="w-8 h-8 flex items-center justify-center border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                                           title="Edit">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                            </svg>
                                        </a>

                                        {{-- Square Delete Icon Button --}}
                                        <button type="button"
                                                @click="$dispatch('open-category-delete-modal', {
                                                    url: '{{ route('admin.categories.destroy', $category->id) }}',
                                                    name: '{{ addslashes($category->name) }}',
                                                    productsCount: {{ $category->products_count }},
                                                    productsUrl: '{{ route('admin.products.index', ['category_id' => $category->id]) }}'
                                                })"
                                                class="w-8 h-8 flex items-center justify-center border border-red-200 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                                                title="Delete">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
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
                    Showing {{ $categories->firstItem() }} to {{ $categories->lastItem() }} of {{ $categories->total() }} categories
                </div>

                <div class="flex items-center gap-4">
                    {{-- Per Page Selector --}}
                    <form method="GET" action="{{ route('admin.categories.index') }}" class="flex items-center gap-1.5">
                        @if(request('search')) <input type="hidden" name="search" value="{{ request('search') }}"> @endif
                        @if(request('status')) <input type="hidden" name="status" value="{{ request('status') }}"> @endif
                        
                        <span>Show</span>
                        <select name="per_page" onchange="this.form.submit()" class="py-1 px-2 border border-slate-200 rounded bg-white text-xs font-semibold focus:outline-none focus:border-blue-600 transition-colors">
                            <option value="10" {{ ($filters['per_page'] ?? 10) == 10 ? 'selected' : '' }}>10</option>
                            <option value="20" {{ ($filters['per_page'] ?? 10) == 20 ? 'selected' : '' }}>20</option>
                            <option value="50" {{ ($filters['per_page'] ?? 10) == 50 ? 'selected' : '' }}>50</option>
                        </select>
                        <span>per page</span>
                    </form>

                    {{-- Nav links --}}
                    <div>
                        {{ $categories->links() }}
                    </div>
                </div>
            </div>
        </div>
    @endif

    {{-- Include Safe Deletion Modal --}}
    @include('admin.components.category-delete-modal')
</div>
@endsection
