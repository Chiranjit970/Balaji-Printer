@extends('admin.layout.app')

@section('title', 'Order Details')

@section('content')
<!-- Breadcrumb -->
<div class="mb-6 flex items-center text-xs text-gray-500">
  <a href="{{ route('admin.orders.index') }}" class="hover:text-blue-600 flex items-center font-medium">
    Orders
  </a>
  <span class="mx-2">/</span>
  <span class="text-gray-900 font-semibold">Order Details</span>
</div>

<!-- Order Header & Actions Toolbar -->
<div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
  <div>
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-bold text-gray-900">Order {{ $order->display_order_id }}</h1>
      @include('admin.components.payment-badge', ['status' => $order->payment_status])
    </div>
    <p class="text-sm text-gray-500 mt-1">Placed on {{ $order->created_at->format('M d, Y h:i A') }}</p>
  </div>
  
  <!-- Actions Toolbar -->
  <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
    <!-- Send Notification Button -->
    <button @click="$dispatch('open-notification-modal')" class="inline-flex items-center px-4 py-2 border border-blue-200 text-blue-600 bg-white rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
      <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Send Notification
    </button>
    
    <!-- Mark Refunded Button -->
    @if($order->payment_status === 'Paid' || strtolower($order->payment_status) === 'paid')
    <form action="{{ route('admin.orders.refund', $order->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to mark this order as refunded?');">
      @csrf
      <button type="submit" class="inline-flex items-center px-4 py-2 border border-amber-200 text-amber-600 bg-white rounded-lg text-sm font-semibold hover:bg-amber-50 transition">
        <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Mark Refunded
      </button>
    </form>
    @endif
    
    <!-- Cancel Order Button -->
    @if(!in_array($order->order_status, ['Delivered', 'Cancelled', 'delivered', 'cancelled']))
    <form action="{{ route('admin.orders.cancel', $order->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to cancel this order?');">
      @csrf
      <button type="submit" class="inline-flex items-center px-4 py-2 border border-red-200 text-red-600 bg-white rounded-lg text-sm font-semibold hover:bg-red-50 transition">
        <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Cancel Order
      </button>
    </form>
    @endif

    <div class="hidden lg:block h-6 w-px bg-gray-200 mx-2"></div>

    <!-- Update Status Dropdown -->
    <form action="{{ route('admin.orders.updateStatus', $order->id) }}" method="POST" class="flex items-center gap-2 flex-grow lg:flex-grow-0">
      @csrf
      <select name="status" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition cursor-pointer">
        @php
          $statuses = ['Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];
        @endphp
        @foreach($statuses as $status)
          <option value="{{ $status }}" {{ strtolower($order->order_status) == strtolower($status) ? 'selected' : '' }}>{{ $status }}</option>
        @endforeach
      </select>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
        Update
      </button>
    </form>
  </div>
</div>

<!-- Information Cards Row -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  <!-- Customer Information Card -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-4">
        <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Customer Information</h3>
      </div>
      <div class="space-y-3 text-sm">
        <div>
          <span class="text-xs font-semibold text-gray-400 uppercase">Name</span>
          <p class="font-semibold text-gray-900 mt-0.5">{{ $order->user->name ?? 'N/A' }}</p>
        </div>
        <div>
          <span class="text-xs font-semibold text-gray-400 uppercase">Phone</span>
          <p class="font-medium text-gray-900 mt-0.5">{{ $order->user->phone ?? 'N/A' }}</p>
        </div>
        <div>
          <span class="text-xs font-semibold text-gray-400 uppercase">Email</span>
          <p class="font-medium text-gray-900 mt-0.5">{{ $order->user->email ?? 'N/A' }}</p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-100 pt-3 mt-4 flex justify-between text-xs text-gray-400">
      <span>User ID</span>
      <span class="font-mono font-medium text-gray-600">#{{ $order->user_id }}</span>
    </div>
  </div>

  <!-- Delivery Address Card -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-4">
        <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Delivery Address</h3>
      </div>
      <div class="space-y-2 text-sm text-gray-900">
        <p class="font-semibold">{{ $order->address->recipient_name ?? 'N/A' }}</p>
        <p class="text-gray-600 mt-1 leading-relaxed">
          {{ $order->address->address_line ?? $order->address->line1 ?? '' }}<br>
          @if(isset($order->address->line2)) {{ $order->address->line2 }}<br>@endif
          {{ $order->address->city ?? '' }}, {{ $order->address->state ?? '' }} - {{ $order->address->pincode ?? '' }}
        </p>
      </div>
    </div>
    <div class="border-t border-gray-100 pt-3 mt-4 flex justify-between text-xs text-gray-400">
      <span>Contact Phone</span>
      <span class="font-semibold text-gray-700">{{ $order->address->phone ?? 'N/A' }}</span>
    </div>
  </div>

  <!-- Order Summary Card -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-4">
        <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Order Summary</h3>
      </div>
      <div class="space-y-2.5 text-sm text-gray-600">
        <div class="flex justify-between">
          <span>Items Total</span>
          <span class="font-medium text-gray-900">₹{{ number_format($order->subtotal, 2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Delivery Fee</span>
          <span class="font-medium text-gray-900">₹{{ number_format($order->delivery_charges, 2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Tax</span>
          <span class="font-medium text-gray-900">₹{{ number_format($order->tax, 2) }}</span>
        </div>
        <div class="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900 text-base">
          <span>Total Amount</span>
          <span class="text-lg text-blue-600">₹{{ number_format($order->total_amount, 2) }}</span>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-100 pt-3 mt-4 flex justify-between text-xs text-gray-400">
      <span>Payment Method</span>
      <span class="font-semibold text-gray-700">{{ $order->payment_method ?? 'Razorpay (Online)' }}</span>
    </div>
  </div>
</div>

<!-- Items Section -->
<div class="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
  <div class="p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
    <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Items</h3>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm whitespace-nowrap">
      <thead>
        <tr class="bg-white border-b border-gray-100 text-gray-500">
          <th class="p-4 font-semibold">Item</th>
          <th class="p-4 font-semibold">Type</th>
          <th class="p-4 font-semibold">Details</th>
          <th class="p-4 font-semibold text-center">Qty</th>
          <th class="p-4 font-semibold text-right">Amount</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        @foreach($order->orderItems as $item)
        <tr class="hover:bg-gray-50 transition">
          <td class="p-4">
            <div class="flex items-center gap-3">
              @if($item->item_type === 'print')
                <div class="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ $item->printJob->file_name ?? 'Document.pdf' }}</div>
                  <div class="text-xs text-gray-500">({{ $item->printJob->pages ?? 0 }} pages)</div>
                </div>
              @else
                <div class="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                  @if(isset($item->product->images) && count($item->product->images) > 0)
                    <img src="{{ $item->product->images[0] }}" alt="Product" class="w-full h-full object-cover">
                  @elseif(isset($item->product->image))
                    <img src="{{ $item->product->image }}" alt="Product" class="w-full h-full object-cover">
                  @else
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  @endif
                </div>
                <div class="font-semibold text-gray-900">{{ $item->product->name ?? 'Product Name' }}</div>
              @endif
            </div>
          </td>
          <td class="p-4 text-gray-600">
            {{ $item->item_type === 'print' ? 'Print Job' : 'Product' }}
          </td>
          <td class="p-4 text-gray-600">
            @if($item->item_type === 'print')
              {{ $item->printJob->paper_size ?? 'A4' }}, 
              {{ $item->printJob->color_mode === 'bw' || $item->printJob->color_mode === 'Black & White' ? 'Black & White' : 'Color' }}, 
              {{ $item->printJob->sides === 'double' || $item->printJob->sides === 'Double Sided' ? 'Double Sided' : 'Single Sided' }}, 
              {{ ucfirst($item->printJob->binding ?? 'No Binding') }}
            @else
              —
            @endif
          </td>
          <td class="p-4 text-center text-gray-900 font-bold">{{ $item->quantity }}</td>
          <td class="p-4 text-right font-bold text-gray-900">₹{{ number_format($item->total_price, 2) }}</td>
        </tr>
        @endforeach
      </tbody>
      <tfoot>
        <tr class="bg-gray-50 border-t border-gray-200">
          <td colspan="4" class="p-4 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Total</td>
          <td class="p-4 text-right font-bold text-gray-900 text-lg">₹{{ number_format($order->total_amount, 2) }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

<!-- Bottom Layout: Print Files (Left) & Payment Info (Right) -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Print Job Files -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-4">
        <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Print Job Files</h3>
      </div>
      
      <div class="space-y-3">
        @php $hasFiles = false; @endphp
        @foreach($order->orderItems as $item)
          @if(($item->item_type === 'print' || $item->item_type === 'print_job') && $item->printJob)
            @php $hasFiles = true; @endphp
            @include('admin.components.file-download-card', ['printJob' => $item->printJob])
          @endif
        @endforeach
        
        @if(!$hasFiles)
          <p class="text-sm text-gray-500 py-6 text-center italic">No print files associated with this order.</p>
        @endif
      </div>
    </div>
    
    @if($hasFiles)
      <div class="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs flex items-start gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <p>Customer documents are sensitive. All access is logged.</p>
      </div>
    @endif
  </div>

  <!-- Payment Information Card -->
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div class="flex items-center gap-2 mb-4">
      <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Payment Information</h3>
    </div>
    
    <div class="space-y-4 text-sm">
      <div class="flex justify-between items-center py-2 border-b border-gray-100">
        <span class="text-gray-500">Payment Status</span>
        <div>@include('admin.components.payment-badge', ['status' => $order->payment_status])</div>
      </div>
      
      <div class="flex justify-between items-center py-2 border-b border-gray-100">
        <span class="text-gray-500">Payment ID</span>
        <span class="font-mono font-semibold text-gray-900">{{ $order->payment->razorpay_payment_id ?? $order->razorpay_payment_id ?? 'N/A' }}</span>
      </div>
      
      <div class="flex justify-between items-center py-2 border-b border-gray-100">
        <span class="text-gray-500">Gateway</span>
        <span class="font-medium text-gray-900">{{ $order->payment->gateway ?? 'Razorpay' }}</span>
      </div>
      
      <div class="flex justify-between items-center py-2 border-b border-gray-100">
        <span class="text-gray-500">Paid On</span>
        <span class="font-medium text-gray-900">
          @if(isset($order->payment->paid_at))
            {{ \Carbon\Carbon::parse($order->payment->paid_at)->format('M d, Y h:i A') }}
          @else
            N/A
          @endif
        </span>
      </div>
      
      @if(isset($order->payment->refund_status) && $order->payment->refund_status !== 'none')
      <div class="flex justify-between items-center py-2 text-amber-600 font-semibold bg-amber-50 px-3 rounded-lg border border-amber-200">
        <span>Refund Status</span>
        <span>{{ ucfirst($order->payment->refund_status) }}</span>
      </div>
      @endif
    </div>
  </div>
</div>

@include('admin.components.notification-modal')

@endsection
