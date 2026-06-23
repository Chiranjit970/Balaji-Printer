@props(['status'])

@php
    $classes = match($status) {
        'in_stock' => 'bg-green-50 text-green-700 border-green-200',
        'out_of_stock' => 'bg-red-50 text-red-700 border-red-200',
        'pre_order' => 'bg-blue-50 text-blue-700 border-blue-200',
        default => 'bg-gray-50 text-gray-700 border-gray-200'
    };

    $label = match($status) {
        'in_stock' => 'In Stock',
        'out_of_stock' => 'Out of Stock',
        'pre_order' => 'Pre Order',
        default => ucfirst(str_replace('_', ' ', $status))
    };
@endphp

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {{ $classes }}">
    {{ $label }}
</span>
