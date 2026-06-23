{{-- Category Deletion Modal --}}
<div x-data="{ open: false, url: '', name: '', productsCount: 0, productsUrl: '' }"
     x-show="open"
     @open-category-delete-modal.window="open = true; url = $event.detail.url; name = $event.detail.name; productsCount = $event.detail.productsCount; productsUrl = $event.detail.productsUrl"
     class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none"
     style="display: none;"
     x-transition>
    
    {{-- Backdrop --}}
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="open = false"></div>

    {{-- Content --}}
    <div class="relative w-full max-w-md p-5 mx-auto bg-white rounded-xl shadow-xl z-10 border border-slate-200">
        <div class="flex items-start justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-900" x-text="productsCount > 0 ? 'Cannot Delete Category' : 'Delete Category?'"></h3>
            <button @click="open = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>

        <div class="mb-5 text-sm text-slate-600 leading-relaxed">
            <template x-if="productsCount > 0">
                <div>
                    <p class="mb-3">
                        The category <strong class="text-slate-800" x-text="name"></strong> contains 
                        <strong class="text-blue-600" x-text="productsCount"></strong> product(s) assigned to it.
                    </p>
                    <p class="text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-xs leading-relaxed">
                        <strong>Safety Block:</strong> You must reassign all products to another category or remove them before you can safely delete this category.
                    </p>
                </div>
            </template>
            <template x-if="productsCount === 0">
                <div>
                    <p class="mb-3">Are you sure you want to permanently delete the category <strong class="text-slate-800" x-text="name"></strong>?</p>
                    <p class="text-slate-500 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs">
                        This category is empty. Deleting it will permanently remove it from the catalog and the customer store menus. This action cannot be undone.
                    </p>
                </div>
            </template>
        </div>

        <div class="flex justify-end gap-3">
            <button @click="open = false" 
                    class="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                Cancel
            </button>
            
            <template x-if="productsCount > 0">
                <a :href="productsUrl" 
                   class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors text-center">
                    Go to Products
                </a>
            </template>
            
            <template x-if="productsCount === 0">
                <form :action="url" method="POST" class="inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" 
                            class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors">
                        Delete Category
                    </button>
                </form>
            </template>
        </div>
    </div>
</div>
