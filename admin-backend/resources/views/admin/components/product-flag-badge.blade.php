@props(['product'])

<div class="flex flex-wrap gap-1 mt-1.5">
    @if($product->is_featured)
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
            Featured
        </span>
    @endif
    @if($product->is_best_seller)
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
            Best Seller
        </span>
    @endif
    @if($product->is_new_arrival)
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800">
            New Arrival
        </span>
    @endif
    @if($product->is_recommended)
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-teal-100 text-teal-800">
            Recommended
        </span>
    @endif
</div>
