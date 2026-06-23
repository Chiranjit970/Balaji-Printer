<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderItem;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RevenueReportService
{
    /**
     * Parse input filters into a start and end Carbon datetime.
     */
    public function parseDates(array $filters): array
    {
        $range = $filters['range'] ?? 'this_week';
        $today = Carbon::today();

        switch ($range) {
            case 'today':
                $start = Carbon::today()->startOfDay();
                $end = Carbon::today()->endOfDay();
                break;
            case 'this_week':
                $start = Carbon::today()->startOfWeek()->startOfDay();
                $end = Carbon::today()->endOfWeek()->endOfDay();
                break;
            case 'this_month':
                $start = Carbon::today()->startOfMonth()->startOfDay();
                $end = Carbon::today()->endOfMonth()->endOfDay();
                break;
            case 'this_year':
                $start = Carbon::today()->startOfYear()->startOfDay();
                $end = Carbon::today()->endOfYear()->endOfDay();
                break;
            case 'custom':
            default:
                if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
                    $start = Carbon::parse($filters['start_date'])->startOfDay();
                    $end = Carbon::parse($filters['end_date'])->endOfDay();
                } else {
                    $start = Carbon::today()->startOfWeek()->startOfDay();
                    $end = Carbon::today()->endOfWeek()->endOfDay();
                }
                break;
        }

        return [$start, $end];
    }

    /**
     * Calculate start and end date of the previous comparison period.
     */
    public function getPreviousPeriod(Carbon $start, Carbon $end): array
    {
        $diffInDays = $start->diffInDays($end) + 1;
        $prevStart = $start->copy()->subDays($diffInDays)->startOfDay();
        $prevEnd = $start->copy()->subDay()->endOfDay();

        return [$prevStart, $prevEnd];
    }

    /**
     * Get KPI Card Summary Metrics with trends.
     */
    public function getSummary(Carbon $start, Carbon $end, Carbon $prevStart, Carbon $prevEnd): array
    {
        // 1. Current stats
        $currRevenue = (float) Payment::whereBetween('paid_at', [$start, $end])
            ->sum('amount');

        $currOrders = (int) Order::where('payment_status', '!=', 'Failed')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $currPaidOrders = (int) Order::where('payment_status', 'Paid')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $currAOV = $currPaidOrders > 0 ? $currRevenue / $currPaidOrders : 0.0;

        $currRefunds = (float) Payment::where('refund_status', 'Refunded')
            ->whereBetween('updated_at', [$start, $end])
            ->sum('amount');

        // 2. Previous stats
        $prevRevenue = (float) Payment::whereBetween('paid_at', [$prevStart, $prevEnd])
            ->sum('amount');

        $prevOrders = (int) Order::where('payment_status', '!=', 'Failed')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->count();

        $prevPaidOrders = (int) Order::where('payment_status', 'Paid')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->count();

        $prevAOV = $prevPaidOrders > 0 ? $prevRevenue / $prevPaidOrders : 0.0;

        $prevRefunds = (float) Payment::where('refund_status', 'Refunded')
            ->whereBetween('updated_at', [$prevStart, $prevEnd])
            ->sum('amount');

        // 3. Trends
        return [
            'revenue' => [
                'value' => $currRevenue,
                'trend' => $this->calculateTrend($currRevenue, $prevRevenue),
            ],
            'orders' => [
                'value' => $currOrders,
                'trend' => $this->calculateTrend($currOrders, $prevOrders),
            ],
            'aov' => [
                'value' => $currAOV,
                'trend' => $this->calculateTrend($currAOV, $prevAOV),
            ],
            'refunds' => [
                'value' => $currRefunds,
                'trend' => $this->calculateTrend($currRefunds, $prevRefunds), // Note: refunds going up is bad (red)
            ],
        ];
    }

    /**
     * Compute trend percentage.
     */
    private function calculateTrend(float $curr, float $prev): array
    {
        if ($prev == 0) {
            $percent = $curr > 0 ? 100.0 : 0.0;
        } else {
            $percent = (($curr - $prev) / $prev) * 100;
        }

        return [
            'percent' => round($percent, 1),
            'direction' => $percent >= 0 ? 'up' : 'down',
        ];
    }

    /**
     * Prepare Revenue Overview Chart Data grouped by day/week/month.
     */
    public function getRevenueChartData(Carbon $start, Carbon $end, string $groupBy): array
    {
        $query = Payment::whereBetween('paid_at', [$start, $end]);

        if ($groupBy === 'month') {
            $query->selectRaw("DATE_FORMAT(paid_at, '%b %Y') as label, SUM(amount) as total, MIN(paid_at) as date_order")
                  ->groupBy('label')
                  ->orderBy('date_order');
        } elseif ($groupBy === 'week') {
            $query->selectRaw("CONCAT('Week ', WEEK(paid_at)) as label, SUM(amount) as total, MIN(paid_at) as date_order")
                  ->groupBy('label')
                  ->orderBy('date_order');
        } else {
            // default group by day
            $query->selectRaw("DATE_FORMAT(paid_at, '%b %d %a') as label, SUM(amount) as total, MIN(paid_at) as date_order")
                  ->groupBy('label')
                  ->orderBy('date_order');
        }

        $results = $query->get();

        return [
            'labels' => $results->pluck('label')->toArray(),
            'values' => $results->pluck('total')->map(fn($v) => (float)$v)->toArray(),
        ];
    }

    /**
     * Prepare Orders By Status Doughnut Chart Data.
     */
    public function getOrdersByStatusData(Carbon $start, Carbon $end): array
    {
        $results = Order::whereBetween('created_at', [$start, $end])
            ->selectRaw('order_status, COUNT(*) as count')
            ->groupBy('order_status')
            ->get()
            ->pluck('count', 'order_status')
            ->toArray();

        $statuses = ['Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];
        $data = [];
        $total = 0;

        foreach ($statuses as $status) {
            $count = $results[$status] ?? 0;
            $data[$status] = $count;
            $total += $count;
        }

        return [
            'total' => $total,
            'counts' => $data,
        ];
    }

    /**
     * Get Revenue Summary breakdown.
     */
    public function getRevenueSummary(Carbon $start, Carbon $end, string $groupBy): array
    {
        $paymentsQuery = Payment::whereBetween('paid_at', [$start, $end]);

        if ($groupBy === 'month') {
            $paymentsQuery->selectRaw("DATE_FORMAT(paid_at, '%Y-%m') as date_group, DATE_FORMAT(paid_at, '%b %Y') as period, SUM(amount) as revenue")
                          ->groupBy('date_group', 'period')
                          ->orderBy('date_group', 'desc');
        } else {
            // Default: daily group
            $paymentsQuery->selectRaw("DATE(paid_at) as date_group, DATE_FORMAT(paid_at, '%M %d, %Y') as period, SUM(amount) as revenue")
                          ->groupBy('date_group', 'period')
                          ->orderBy('date_group', 'desc');
        }

        $payments = $paymentsQuery->get()->keyBy('date_group');

        // Get paid orders count per date group
        $ordersQuery = Order::where('payment_status', 'Paid')
            ->whereBetween('created_at', [$start, $end]);

        if ($groupBy === 'month') {
            $ordersQuery->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as date_group, COUNT(*) as count")
                       ->groupBy('date_group');
        } else {
            $ordersQuery->selectRaw("DATE(created_at) as date_group, COUNT(*) as count")
                       ->groupBy('date_group');
        }

        $orders = $ordersQuery->get()->pluck('count', 'date_group')->toArray();

        $summary = [];
        foreach ($payments as $key => $payment) {
            $orderCount = $orders[$key] ?? 0;
            $revenue = (float)$payment->revenue;
            $summary[] = [
                'period' => $payment->period,
                'orders' => $orderCount,
                'revenue' => $revenue,
                'aov' => $orderCount > 0 ? $revenue / $orderCount : 0.0,
            ];
        }

        return $summary;
    }

    /**
     * Get Top Selling Categories (by Revenue)
     */
    public function getTopSellingCategories(Carbon $start, Carbon $end): array
    {
        // 1. Calculate Product Sales by Category
        // order_items -> product -> category
        $productSales = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('orders.payment_status', 'Paid')
            ->whereBetween('orders.created_at', [$start, $end])
            ->selectRaw('categories.name as category_name, COUNT(DISTINCT orders.id) as orders_count, SUM(order_items.total_price) as revenue')
            ->groupBy('categories.id', 'categories.name')
            ->get();

        // 2. Calculate Print Service Sales
        // order_items where item_type = print_job
        $printSales = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.item_type', 'print_job')
            ->where('orders.payment_status', 'Paid')
            ->whereBetween('orders.created_at', [$start, $end])
            ->selectRaw("COUNT(DISTINCT orders.id) as orders_count, SUM(order_items.total_price) as revenue")
            ->first();

        $categories = [];
        $totalRevenue = 0.0;
        $totalOrders = 0;

        // Print Services Category item
        if ($printSales && (float)$printSales->revenue > 0) {
            $categories[] = [
                'name' => 'Print Services',
                'orders' => (int)$printSales->orders_count,
                'revenue' => (float)$printSales->revenue,
            ];
            $totalRevenue += (float)$printSales->revenue;
            $totalOrders += (int)$printSales->orders_count;
        }

        // Add Product Categories
        foreach ($productSales as $sale) {
            $categories[] = [
                'name' => $sale->category_name,
                'orders' => (int)$sale->orders_count,
                'revenue' => (float)$sale->revenue,
            ];
            $totalRevenue += (float)$sale->revenue;
            $totalOrders += (int)$sale->orders_count;
        }

        // Sort categories by revenue DESC
        usort($categories, fn($a, $b) => $b['revenue'] <=> $a['revenue']);

        // Calculate % of Total
        foreach ($categories as &$cat) {
            $cat['percent'] = $totalRevenue > 0 ? ($cat['revenue'] / $totalRevenue) * 100 : 0.0;
        }

        return [
            'categories' => $categories,
            'total_revenue' => $totalRevenue,
            'total_orders' => $totalOrders,
        ];
    }
}
