{{-- Delete Confirmation Modal --}}
<div x-data="{ open: false, url: '', name: '', referenced: false }"
     x-show="open"
     @open-delete-modal.window="open = true; url = $event.detail.url; name = $event.detail.name; referenced = $event.detail.referenced"
     class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none"
     style="display: none;"
     x-transition>
    
    {{-- Backdrop --}}
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="open = false"></div>

    {{-- Content --}}
    <div class="relative w-full max-w-md p-4 mx-auto bg-white rounded-xl shadow-xl z-10 border border-slate-200">
        <div class="flex items-start justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-900" x-text="referenced ? 'Deactivate Product' : 'Delete Product'"></h3>
            <button @click="open = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>

        <div class="mb-5 text-sm text-slate-600">
            <template x-if="referenced">
                <div>
                    <p class="mb-2">The product <strong class="text-slate-800" x-text="name"></strong> is referenced in existing customer orders.</p>
                    <p class="text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs leading-relaxed">
                        <strong>Warning:</strong> Hard deleting this product would break order history reports. Instead, it will be <strong>deactivated</strong> (marked as inactive), hiding it from the customer store catalog while preserving existing order documents.
                    </p>
                </div>
            </template>
            <template x-if="!referenced">
                <div>
                    <p class="mb-2">Are you sure you want to delete <strong class="text-slate-800" x-text="name"></strong>?</p>
                    <p class="text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg text-xs leading-relaxed">
                        This product is not linked to any orders. Deleting it will permanently remove the record and all associated images from local storage. This action cannot be undone.
                    </p>
                </div>
            </template>
        </div>

        <div class="flex justify-end gap-3">
            <button @click="open = false" 
                    class="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                Cancel
            </button>
            <form :action="url" method="POST" class="inline">
                @csrf
                @method('DELETE')
                <button type="submit" 
                        class="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
                        :class="referenced ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'"
                        x-text="referenced ? 'Deactivate' : 'Delete Permanent'">
                </button>
            </form>
        </div>
    </div>
</div>
