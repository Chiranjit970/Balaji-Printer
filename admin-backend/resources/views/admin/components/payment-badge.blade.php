@props(['status'])

@php
    $classes = [
        'Paid' => 'bg-green-50 text-green-700',
        'Pending' => 'bg-amber-50 text-amber-700',
        'Failed' => 'bg-red-50 text-red-700',
        'Refunded' => 'bg-gray-100 text-gray-600',
    ];
    $badgeClass = $classes[$status] ?? 'bg-gray-100 text-gray-700';
@endphp

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $badgeClass }}">
    {{ $status }}
</span>
