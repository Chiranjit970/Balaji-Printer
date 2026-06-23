<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        // Total Orders Today
        $totalOrdersToday = Order::whereDate('created_at', Carbon::today())->count();

        // Pending Orders (Placed + Processing, case-insensitive support)
        $pendingOrders = Order::whereIn('order_status', ['placed', 'processing', 'Placed', 'Processing'])->count();

        // Revenue Today (sum total_amount for orders created today where payment is paid)
        $revenueToday = Order::whereDate('created_at', Carbon::today())
            ->whereIn('payment_status', ['paid', 'Paid'])
            ->sum('total_amount');

        // Total Customers
        $totalCustomers = User::count();

        $stats = [
            'totalOrdersToday' => $totalOrdersToday,
            'pendingOrders' => $pendingOrders,
            'revenueToday' => $revenueToday,
            'totalCustomers' => $totalCustomers,
        ];

        // Dynamic Chart Data for the last 7 days
        $labels = [];
        $orders = [];
        $revenue = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $labels[] = $date->format('M d');

            $orders[] = Order::whereDate('created_at', $date)->count();

            $revenue[] = (float) Order::whereDate('created_at', $date)
                ->whereIn('payment_status', ['paid', 'Paid'])
                ->sum('total_amount');
        }

        $chartData = [
            'labels' => $labels,
            'orders' => $orders,
            'revenue' => $revenue,
        ];

        // Recent Orders eager loaded with user and items count
        $recentOrders = Order::with(['user', 'orderItems'])
            ->latest()
            ->take(5)
            ->get();

        return view('admin.dashboard', compact('stats', 'chartData', 'recentOrders'));
    }
}

