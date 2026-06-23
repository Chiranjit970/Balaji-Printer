@extends('admin.layout.app')

@section('title', 'Dashboard')

@section('content')
<!-- Page Header -->
<div class="page-header flex-between mb-6">
  <div class="page-title-group">
    <h1 class="text-h2">Dashboard Overview</h1>
    <p class="text-body text-muted">Welcome back, {{ auth('admin')->user()->name ?? 'Admin' }}! Here's what's happening with your store today.</p>
  </div>
  
  <div class="date-picker-dropdown">
    <button class="date-picker-btn text-body-semibold">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      {{ now()->format('M d, Y') }}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="m6 9 6 6 6-6"></path></svg>
    </button>
  </div>
</div>

<!-- KPI Cards -->
<div class="kpi-grid">
  <!-- Total Orders -->
  <div class="kpi-card">
    <div class="kpi-icon-wrapper bg-blue-50 text-blue-600">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
    </div>
    <div class="kpi-content">
      <p class="text-caption font-medium text-muted">Total Orders Today</p>
      <h3 class="text-display m-0">{{ $stats['totalOrdersToday'] ?? 0 }}</h3>
      <div class="kpi-trend trend-up">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
        <span>12%</span> <span class="text-muted ml-1 font-normal">vs yesterday</span>
      </div>
    </div>
  </div>

  <!-- Pending Orders -->
  <div class="kpi-card">
    <div class="kpi-icon-wrapper bg-amber-50 text-amber-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    </div>
    <div class="kpi-content">
      <p class="text-caption font-medium text-muted">Pending Orders</p>
      <h3 class="text-display m-0">{{ $stats['pendingOrders'] ?? 0 }}</h3>
      <div class="kpi-trend trend-up">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
        <span>8%</span> <span class="text-muted ml-1 font-normal">vs yesterday</span>
      </div>
      <p class="text-caption text-muted mt-1">(Placed + Processing)</p>
    </div>
  </div>

  <!-- Revenue Today -->
  <div class="kpi-card">
    <div class="kpi-icon-wrapper bg-green-50 text-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    </div>
    <div class="kpi-content">
      <p class="text-caption font-medium text-muted">Total Revenue Today</p>
      <h3 class="text-display m-0">₹{{ number_format($stats['revenueToday'] ?? 0) }}</h3>
      <div class="kpi-trend trend-up">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
        <span>15%</span> <span class="text-muted ml-1 font-normal">vs yesterday</span>
      </div>
    </div>
  </div>

  <!-- Total Customers -->
  <div class="kpi-card">
    <div class="kpi-icon-wrapper bg-purple-50 text-purple-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    </div>
    <div class="kpi-content">
      <p class="text-caption font-medium text-muted">Total Customers</p>
      <h3 class="text-display m-0">{{ $stats['totalCustomers'] ?? 0 }}</h3>
      <div class="kpi-trend trend-up">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
        <span>10%</span> <span class="text-muted ml-1 font-normal">vs yesterday</span>
      </div>
    </div>
  </div>
</div>

<!-- Charts Row -->
<div class="charts-grid mt-6">
  <!-- Orders Trend -->
  <div class="chart-card">
    <div class="chart-header flex-between mb-4">
      <h3 class="text-body-semibold">Orders Trend (Daily)</h3>
      <div class="filter-dropdown">
        <button class="filter-btn text-caption font-medium">
          7 Days
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="m6 9 6 6 6-6"></path></svg>
        </button>
      </div>
    </div>
    <div class="chart-container" style="position: relative; height:250px; width:100%">
      <canvas id="ordersChart"></canvas>
    </div>
  </div>

  <!-- Revenue Trend -->
  <div class="chart-card">
    <div class="chart-header flex-between mb-4">
      <h3 class="text-body-semibold">Revenue Trend (Daily)</h3>
      <div class="filter-dropdown">
        <button class="filter-btn text-caption font-medium">
          7 Days
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="m6 9 6 6 6-6"></path></svg>
        </button>
      </div>
    </div>
    <div class="chart-container" style="position: relative; height:250px; width:100%">
      <canvas id="revenueChart"></canvas>
    </div>
  </div>
</div>

<!-- Recent Orders -->
<div class="recent-orders-card mt-6">
  <div class="card-header flex-between mb-4">
    <h3 class="text-body-semibold m-0">Recent Orders</h3>
    <a href="{{ route('admin.orders.index') }}" class="text-blue text-caption font-medium flex items-center view-all-link hover:underline">
      View All Orders 
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="m9 18 6-6-6-6"></path></svg>
    </a>
  </div>
  
  <div class="table-responsive">
    <table class="admin-table w-full text-left">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Items Count</th>
          <th>Amount</th>
          <th>Payment</th>
          <th>Status</th>
          <th>Order Date</th>
        </tr>
      </thead>
      <tbody>
        @forelse($recentOrders as $order)
        <tr>
          <td class="font-medium">{{ $order->display_order_id }}</td>
          <td>{{ $order->user->name ?? 'N/A' }}</td>
          <td class="text-muted">{{ $order->orderItems->count() }} Items</td>
          <td class="font-medium">₹{{ number_format($order->total_amount, 2) }}</td>
          <td>
            @include('admin.components.payment-badge', ['status' => $order->payment_status])
          </td>
          <td>
            @include('admin.components.status-badge', ['status' => $order->order_status])
          </td>
          <td class="text-muted">{{ $order->created_at->format('M d, Y h:i A') }}</td>
        </tr>
        @empty
        <tr>
          <td colspan="7" class="text-center py-4 text-muted">No recent orders found.</td>
        </tr>
        @endforelse
      </tbody>
    </table>
  </div>
</div>

@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Pass PHP chart data to JS
  const chartLabels = {!! json_encode($chartData['labels'] ?? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']) !!};
  const orderData = {!! json_encode($chartData['orders'] ?? [0,0,0,0,0,0,0]) !!};
  const revenueData = {!! json_encode($chartData['revenue'] ?? [0,0,0,0,0,0,0]) !!};

  // Orders Chart
  const ordersCtx = document.getElementById('ordersChart');
  if (ordersCtx) {
    new Chart(ordersCtx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Orders',
          data: orderData,
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F3F4F6', drawBorder: false } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Revenue Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Revenue (₹)',
          data: revenueData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#fff',
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F3F4F6', drawBorder: false } },
          x: { grid: { display: false } }
        }
      }
    });
  }
});
</script>
@endpush
