@props(['actionRoute'])

<div x-show="selectedIds.length > 0"
     x-transition:enter="transition ease-out duration-300"
     x-transition:enter-start="opacity-0 translate-y-2"
     x-transition:enter-end="opacity-100 translate-y-0"
     x-transition:leave="transition ease-in duration-200"
     x-transition:leave-start="opacity-100 translate-y-0"
     x-transition:leave-end="opacity-0 translate-y-2"
     class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4"
     style="display: none;">
    
    <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
        <span class="text-sm font-semibold text-blue-900">
            <span x-text="selectedIds.length"></span> products selected
        </span>
    </div>

    <form method="POST" action="{{ $actionRoute }}" id="bulkForm" class="flex flex-wrap items-center gap-2">
        @csrf
        <input type="hidden" name="action" x-bind:value="bulkAction">
        
        {{-- Inject selected product IDs into hidden inputs --}}
        <template x-for="id in selectedIds" :key="id">
            <input type="hidden" name="product_ids[]" :value="id">
        </template>

        <button type="button" 
                @click="bulkAction = 'activate'; $nextTick(() => $el.closest('form').submit())"
                class="px-3 py-1.5 bg-white text-xs font-semibold text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
            Activate
        </button>

        <button type="button" 
                @click="bulkAction = 'deactivate'; $nextTick(() => $el.closest('form').submit())"
                class="px-3 py-1.5 bg-white text-xs font-semibold text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
            Deactivate
        </button>

        <button type="button" 
                @click="if(confirm('Are you sure you want to process deletion for ' + selectedIds.length + ' products? Order-referenced products will only be deactivated.')) { bulkAction = 'delete'; $nextTick(() => $el.closest('form').submit()) }"
                class="px-3 py-1.5 bg-red-600 text-xs font-semibold text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete Selected
        </button>
        
        <button type="button" 
                @click="selectedIds = []" 
                class="text-xs text-blue-600 hover:text-blue-800 font-medium ml-2">
            Cancel
        </button>
    </form>
</div>
