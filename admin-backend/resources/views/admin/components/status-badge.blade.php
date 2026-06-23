@props(['status'])

@php
    $classes = [
        'Placed' => 'bg-blue-50 text-blue-700',
        'Processing' => 'bg-amber-50 text-amber-700',
        'Dispatched' => 'bg-indigo-50 text-indigo-700',
        'Delivered' => 'bg-green-50 text-green-700',
        'Cancelled' => 'bg-red-50 text-red-700',
    ];
    $badgeClass = $classes[$status] ?? 'bg-gray-100 text-gray-700';
@endphp

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $badgeClass }}">
    {{ $status }}
</span>
