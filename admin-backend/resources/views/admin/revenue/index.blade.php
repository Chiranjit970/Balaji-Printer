@extends('admin.layout.app')
@section('title', 'Revenue / Reports')

@section('content')
<div>
    {{-- Page Header / Title --}}
    <div class="mb-5">
        <h1 class="text-2xl font-bold text-slate-900">Revenue &amp; Reports</h1>
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

    {{-- Date Range Selector Bar --}}
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
        <form id="filterForm" method="GET" action="{{ route('admin.revenue.index') }}" class="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            {{-- Quick Filter Pills --}}
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0">
                <input type="hidden" name="range" id="rangeInput" value="{{ $filters['range'] }}">
                <input type="hidden" name="group_by" id="groupByInput" value="{{ $filters['group_by'] }}">

                @foreach([
                    'today'      => 'Today',
                    'this_week'  => 'This Week',
                    'this_month' => 'This Month',
                    'this_year'  => 'This Year',
                    'custom'     => 'Custom'
                ] as $val => $label)
                    <button type="button" 
                            onclick="setRange('{{ $val }}')"
                            class="px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap
                                   {{ $filters['range'] === $val 
                                       ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                       : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' }}">
                        {{ $label }}
                    </button>
                @endforeach
            </div>

            {{-- Custom Date Inputs & Action Buttons --}}
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {{-- Date Inputs (Shown if custom) --}}
                <div class="flex items-center gap-2 {{ $filters['range'] === 'custom' ? '' : 'hidden' }}" id="customDatesContainer">
                    <input type="date" name="start_date" value="{{ $start->format('Y-m-d') }}"
                           class="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    <span class="text-slate-400 text-sm">to</span>
                    <input type="date" name="end_date" value="{{ $end->format('Y-m-d') }}"
                           class="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                </div>

                {{-- Action Buttons --}}
                <div class="flex items-center gap-2 justify-end">
                    <a href="{{ route('admin.revenue.index', ['range' => $filters['range']]) }}" 
                       class="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2"/>
                        </svg>
                        Refresh
                    </a>

                    <a href="{{ route('admin.revenue.export', $filters) }}" 
                       class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Export CSV
                    </a>
                </div>
            </div>
        </form>
    </div>

    {{-- KPI Cards Grid --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        
        {{-- Card 1: Total Revenue --}}
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-bold text-lg">₹</div>
            <div class="min-w-0">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                <h3 class="text-2xl font-extrabold text-slate-900 mt-1">₹{{ number_format($summary['revenue']['value'], 2) }}</h3>
                <p class="text-xs mt-2 flex items-center gap-1">
                    @if($summary['revenue']['trend']['percent'] >= 0)
                        <span class="text-green-600 font-semibold flex items-center">
                            ↑ {{ $summary['revenue']['trend']['percent'] }}%
                        </span>
                    @else
                        <span class="text-red-600 font-semibold flex items-center">
                            ↓ {{ abs($summary['revenue']['trend']['percent']) }}%
                        </span>
                    @endif
                    <span class="text-slate-400">vs prev period</span>
                </p>
            </div>
        </div>

        {{-- Card 2: Total Orders --}}
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
            </div>
            <div class="min-w-0">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
                <h3 class="text-2xl font-extrabold text-slate-900 mt-1">{{ number_format($summary['orders']['value']) }}</h3>
                <p class="text-xs mt-2 flex items-center gap-1">
                    @if($summary['orders']['trend']['percent'] >= 0)
                        <span class="text-green-600 font-semibold flex items-center">
                            ↑ {{ $summary['orders']['trend']['percent'] }}%
                        </span>
                    @else
                        <span class="text-red-600 font-semibold flex items-center">
                            ↓ {{ abs($summary['orders']['trend']['percent']) }}%
                        </span>
                    @endif
                    <span class="text-slate-400">vs prev period</span>
                </p>
            </div>
        </div>

        {{-- Card 3: Average Order Value --}}
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
            </div>
            <div class="min-w-0">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Order Value</p>
                <h3 class="text-2xl font-extrabold text-slate-900 mt-1">₹{{ number_format($summary['aov']['value'], 2) }}</h3>
                <p class="text-xs mt-2 flex items-center gap-1">
                    @if($summary['aov']['trend']['percent'] >= 0)
                        <span class="text-green-600 font-semibold flex items-center">
                            ↑ {{ $summary['aov']['trend']['percent'] }}%
                        </span>
                    @else
                        <span class="text-red-600 font-semibold flex items-center">
                            ↓ {{ abs($summary['aov']['trend']['percent']) }}%
                        </span>
                    @endif
                    <span class="text-slate-400">vs prev period</span>
                </p>
            </div>
        </div>

        {{-- Card 4: Refunds --}}
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2"/>
                </svg>
            </div>
            <div class="min-w-0">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Refunds</p>
                <h3 class="text-2xl font-extrabold text-slate-900 mt-1">₹{{ number_format($summary['refunds']['value'], 2) }}</h3>
                <p class="text-xs mt-2 flex items-center gap-1">
                    {{-- Note: for refunds, increases are bad (red), decreases are good (green) --}}
                    @if($summary['refunds']['trend']['percent'] >= 0)
                        <span class="text-red-600 font-semibold flex items-center">
                            ↑ {{ $summary['refunds']['trend']['percent'] }}%
                        </span>
                    @else
                        <span class="text-green-600 font-semibold flex items-center">
                            ↓ {{ abs($summary['refunds']['trend']['percent']) }}%
                        </span>
                    @endif
                    <span class="text-slate-400">vs prev period</span>
                </p>
            </div>
        </div>

    </div>

    {{-- Charts Section --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {{-- Revenue Overview Line Chart (2/3 width) --}}
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 class="text-base font-bold text-slate-900">Revenue Overview</h3>
                
                {{-- Group By Controls --}}
                <div class="flex items-center gap-1.5">
                    <span class="text-xs text-slate-400">Group By:</span>
                    <select onchange="setGroupBy(this.value)" class="py-1 px-2 border border-slate-200 rounded bg-white text-xs font-semibold focus:outline-none focus:border-blue-600 transition-colors">
                        <option value="day" {{ $filters['group_by'] === 'day' ? 'selected' : '' }}>Day</option>
                        <option value="week" {{ $filters['group_by'] === 'week' ? 'selected' : '' }}>Week</option>
                        <option value="month" {{ $filters['group_by'] === 'month' ? 'selected' : '' }}>Month</option>
                    </select>
                </div>
            </div>

            <div class="relative h-72">
                <canvas id="revenueLineChart"></canvas>
            </div>
        </div>

        {{-- Orders By Status Doughnut Chart (1/3 width) --}}
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-1">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 class="text-base font-bold text-slate-900">Orders by Status</h3>
            </div>

            <div class="relative h-56 flex items-center justify-center">
                <canvas id="ordersDoughnutChart" class="max-w-[200px] max-h-[200px]"></canvas>
                {{-- Center text overlay --}}
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                    <span class="text-2xl font-black text-slate-900">{{ $ordersByStatus['total'] }}</span>
                    <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Orders</span>
                </div>
            </div>

            {{-- Custom Legend to Match Reference exactly --}}
            <div class="mt-4 space-y-1.5 text-xs text-slate-600 max-w-[240px] mx-auto">
                @php
                    $colors = [
                        'Placed'     => '#2563EB',
                        'Processing' => '#D97706',
                        'Dispatched' => '#6366F1',
                        'Delivered'  => '#16A34A',
                        'Cancelled'  => '#DC2626',
                    ];
                @endphp
                @foreach($ordersByStatus['counts'] as $status => $count)
                    @php
                        $percent = $ordersByStatus['total'] > 0 ? ($count / $ordersByStatus['total']) * 100 : 0.0;
                    @endphp
                    <div class="flex items-center justify-between gap-4">
                        <span class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full shrink-0" style="background-color: {{ $colors[$status] }}"></span>
                            <span class="font-medium text-slate-700">{{ $status }}</span>
                        </span>
                        <span class="font-semibold text-slate-900">
                            {{ $count }} <span class="text-[10px] text-slate-400 font-normal">({{ round($percent, 1) }}%)</span>
                        </span>
                    </div>
                @endforeach
            </div>
        </div>

    </div>

    {{-- Tables Section --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {{-- Revenue Summary Table --}}
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
                <div class="p-4 border-b border-slate-100">
                    <h3 class="text-base font-bold text-slate-900">Revenue Summary</h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th class="py-2.5 px-4">Period</th>
                                <th class="py-2.5 px-4 text-center">Orders</th>
                                <th class="py-2.5 px-4 text-right">Revenue (₹)</th>
                                <th class="py-2.5 px-4 text-right">Avg Order Value (₹)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-700">
                            @php
                                $totOrders = 0;
                                $totRev = 0.0;
                            @endphp
                            @forelse($revenueSummary as $row)
                                @php
                                    $totOrders += $row['orders'];
                                    $totRev += $row['revenue'];
                                @endphp
                                <tr class="hover:bg-slate-50/50 transition-colors">
                                    <td class="py-2.5 px-4 font-semibold text-slate-900">{{ $row['period'] }}</td>
                                    <td class="py-2.5 px-4 text-center font-medium">{{ $row['orders'] }}</td>
                                    <td class="py-2.5 px-4 text-right font-semibold text-slate-900">₹{{ number_format($row['revenue'], 2) }}</td>
                                    <td class="py-2.5 px-4 text-right font-medium text-slate-500">₹{{ number_format($row['aov'], 2) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="p-8 text-center text-slate-400 italic">No summary records found.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            {{-- Footer Summary Total Row --}}
            @if(!empty($revenueSummary))
                <div class="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-sm font-bold text-slate-900">
                    <span>Total</span>
                    <div class="flex items-center gap-10">
                        <span>{{ $totOrders }}</span>
                        <span>₹{{ number_format($totRev, 2) }}</span>
                    </div>
                </div>
            @endif
        </div>

        {{-- Top Selling Categories Table --}}
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
                <div class="p-4 border-b border-slate-100">
                    <h3 class="text-base font-bold text-slate-900">Top Selling Categories (by Revenue)</h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th class="py-2.5 px-4">Category</th>
                                <th class="py-2.5 px-4 text-center">Orders</th>
                                <th class="py-2.5 px-4 text-right">Revenue (₹)</th>
                                <th class="py-2.5 px-4 text-right">% of Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-700">
                            @forelse($topCategories['categories'] as $cat)
                                <tr class="hover:bg-slate-50/50 transition-colors">
                                    <td class="py-2.5 px-4 font-semibold text-slate-900">{{ $cat['name'] }}</td>
                                    <td class="py-2.5 px-4 text-center font-medium">{{ $cat['orders'] }}</td>
                                    <td class="py-2.5 px-4 text-right font-semibold text-slate-900">₹{{ number_format($cat['revenue'], 2) }}</td>
                                    <td class="py-2.5 px-4 text-right font-medium text-slate-500">{{ round($cat['percent'], 2) }}%</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="p-8 text-center text-slate-400 italic">No sales recorded.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            {{-- Footer Summary Total Row --}}
            @if(!empty($topCategories['categories']))
                <div class="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-sm font-bold text-slate-900">
                    <span>Total</span>
                    <div class="flex items-center gap-10">
                        <span>{{ $topCategories['total_orders'] }}</span>
                        <span>₹{{ number_format($topCategories['total_revenue'], 2) }}</span>
                    </div>
                </div>
            @endif
        </div>

    </div>

</div>
@endsection

@push('scripts')
<script>
    function setRange(rangeVal) {
        document.getElementById('rangeInput').value = rangeVal;
        document.getElementById('filterForm').submit();
    }

    function setGroupBy(groupVal) {
        document.getElementById('groupByInput').value = groupVal;
        document.getElementById('filterForm').submit();
    }

    // Chart.js Configuration
    document.addEventListener("DOMContentLoaded", function () {
        
        // 1. Line Chart initialization
        const lineCtx = document.getElementById('revenueLineChart').getContext('2d');
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: {!! json_encode($chartData['labels']) !!},
                datasets: [{
                    label: 'Revenue (₹)',
                    data: {!! json_encode($chartData['values']) !!},
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let val = context.parsed.y || 0;
                                return 'Revenue: ₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 10
                            },
                            color: '#64748B'
                        }
                    },
                    y: {
                        grid: {
                            color: '#F1F5F9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 10
                            },
                            color: '#64748B',
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });

        // 2. Doughnut Chart initialization
        const doughnutCtx = document.getElementById('ordersDoughnutChart').getContext('2d');
        const counts = {!! json_encode($ordersByStatus['counts']) !!};
        
        new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(counts),
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: [
                        '#2563EB', // Placed
                        '#D97706', // Processing
                        '#6366F1', // Dispatched
                        '#16A34A', // Delivered
                        '#DC2626'  // Cancelled
                    ],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                let value = context.parsed || 0;
                                let sum = context.dataset.data.reduce((a, b) => a + b, 0);
                                let percent = sum > 0 ? Math.round((value / sum) * 1000) / 10 : 0;
                                return label + ': ' + value + ' (' + percent + '%)';
                            }
                        }
                    }
                }
            }
        });

    });
</script>
@endpush
