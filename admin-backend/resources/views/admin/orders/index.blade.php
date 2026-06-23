@extends('admin.layout.app')

@section('title', 'Orders')

@section('content')
<!-- Page Header -->
<div class="mb-6 flex justify-between items-center">
  <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
</div>

<!-- Summary Statistics Row -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
  <!-- Total Orders -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
      <p class="text-3xl font-bold text-gray-900 mt-1">{{ $summary['total'] ?? 0 }}</p>
    </div>
    <div class="p-3 bg-gray-50 text-gray-700 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    </div>
  </div>

  <!-- Pending Orders -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p class="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Orders</p>
      <p class="text-3xl font-bold text-amber-600 mt-1">{{ $summary['pending'] ?? 0 }}</p>
    </div>
    <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    </div>
  </div>

  <!-- Delivered Orders -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p class="text-xs font-semibold text-green-700 uppercase tracking-wider">Delivered</p>
      <p class="text-3xl font-bold text-green-600 mt-1">{{ $summary['delivered'] ?? 0 }}</p>
    </div>
    <div class="p-3 bg-green-50 text-green-600 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </div>
  </div>

  <!-- Cancelled Orders -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p class="text-xs font-semibold text-red-700 uppercase tracking-wider">Cancelled</p>
      <p class="text-3xl font-bold text-red-600 mt-1">{{ $summary['cancelled'] ?? 0 }}</p>
    </div>
    <div class="p-3 bg-red-50 text-red-600 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
    </div>
  </div>
</div>

<!-- Filter Toolbar -->
<div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
  <form action="{{ route('admin.orders.index') }}" method="GET" class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
    <!-- Search Input -->
    <div class="lg:col-span-4">
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Search</label>
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" name="search" value="{{ request('search') }}" class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition" placeholder="Search by Order ID or Phone">
      </div>
    </div>

    <!-- Status Dropdown -->
    <div class="lg:col-span-2">
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
      <select name="status" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition cursor-pointer">
        <option value="">All Status</option>
        <option value="Placed" {{ request('status') == 'Placed' ? 'selected' : '' }}>Placed</option>
        <option value="Processing" {{ request('status') == 'Processing' ? 'selected' : '' }}>Processing</option>
        <option value="Dispatched" {{ request('status') == 'Dispatched' ? 'selected' : '' }}>Dispatched</option>
        <option value="Delivered" {{ request('status') == 'Delivered' ? 'selected' : '' }}>Delivered</option>
        <option value="Cancelled" {{ request('status') == 'Cancelled' ? 'selected' : '' }}>Cancelled</option>
      </select>
    </div>

    <!-- Payment Status Dropdown -->
    <div class="lg:col-span-2">
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Status</label>
      <select name="payment_status" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition cursor-pointer">
        <option value="">All Payment Status</option>
        <option value="Paid" {{ request('payment_status') == 'Paid' ? 'selected' : '' }}>Paid</option>
        <option value="Pending" {{ request('payment_status') == 'Pending' ? 'selected' : '' }}>Pending</option>
        <option value="Failed" {{ request('payment_status') == 'Failed' ? 'selected' : '' }}>Failed</option>
        <option value="Refunded" {{ request('payment_status') == 'Refunded' ? 'selected' : '' }}>Refunded</option>
      </select>
    </div>

    <!-- Date Range Dropdown -->
    <div class="lg:col-span-2">
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date Range</label>
      <select name="date" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition cursor-pointer">
        <option value="all">All Time</option>
        <option value="today" {{ request('date') == 'today' ? 'selected' : '' }}>Today</option>
        <option value="7days" {{ request('date') == '7days' ? 'selected' : '' }}>Last 7 Days</option>
        <option value="30days" {{ request('date') == '30days' ? 'selected' : '' }}>Last 30 Days</option>
      </select>
    </div>

    <!-- Actions -->
    <div class="lg:col-span-2 flex gap-2">
      <a href="{{ route('admin.orders.index') }}" class="w-1/2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 transition">Reset</a>
      <button type="submit" class="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        Filter
      </button>
    </div>
  </form>
</div>

<!-- Orders Table Card -->
<div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm whitespace-nowrap">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Amount</th>
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Payment Status</th>
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Order Status</th>
          <th class="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        @forelse($orders as $order)
        <tr class="hover:bg-gray-50 transition">
          <td class="p-4 font-semibold text-gray-900">{{ $order->display_order_id }}</td>
          <td class="p-4 text-gray-500">{{ $order->created_at->format('M d, Y h:i A') }}</td>
          <td class="p-4 text-gray-900 font-medium">{{ $order->user->name ?? 'N/A' }}</td>
          <td class="p-4 text-gray-500">{{ $order->user->phone ?? 'N/A' }}</td>
          <td class="p-4 font-bold text-gray-900 text-right">₹{{ number_format($order->total_amount, 2) }}</td>
          <td class="p-4 text-center">
            @include('admin.components.payment-badge', ['status' => $order->payment_status])
          </td>
          <td class="p-4 text-center">
            @include('admin.components.status-badge', ['status' => $order->order_status])
          </td>
          <td class="p-4 text-right">
            <a href="{{ route('admin.orders.show', $order->id) }}" class="inline-flex items-center px-3 py-1.5 border border-blue-200 text-blue-600 rounded-md text-xs font-semibold bg-white hover:bg-blue-50 transition">View Details</a>
          </td>
        </tr>
        @empty
        <tr>
          <td colspan="8" class="p-16 text-center">
            <div class="flex flex-col items-center justify-center">
              <div class="p-4 bg-gray-50 text-gray-400 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              </div>
              <h3 class="text-base font-semibold text-gray-900">No orders found</h3>
              <p class="text-sm text-gray-500 mt-1">Try adjusting your filters or search.</p>
              <a href="{{ route('admin.orders.index') }}" class="text-blue-600 text-sm font-semibold mt-4 hover:underline">Reset Filters</a>
            </div>
          </td>
        </tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <!-- Pagination Footer -->
  <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
    <div>
      Showing 1 to {{ $orders->count() }} of {{ $orders->total() }} orders
    </div>
    <div>
      {{ $orders->links() }}
    </div>
  </div>
</div>
@endsection
