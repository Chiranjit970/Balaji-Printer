@extends('admin.layout.app')
@section('title', 'User Details')

@section('content')
<div x-data="{ 
    editOpen: false, 
    notifyOpen: false, 
    blockOpen: false,
    blockUrl: '{{ route('admin.users.toggleBlock', $user->id) }}'
}">
    {{-- Header --}}
    <div class="flex items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <a href="{{ route('admin.users.index') }}" class="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
            </a>
            <h1 class="text-2xl font-bold text-slate-900">User Details</h1>
        </div>

        <div class="flex items-center gap-2.5">
            {{-- Status Badge --}}
            @if(!$user->is_blocked)
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    Active
                </span>
            @else
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    Blocked
                </span>
            @endif

            {{-- Block/Unblock toggle top button --}}
            @if(!$user->is_blocked)
                <button type="button" @click="blockOpen = true"
                        class="px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors">
                    Block User
                </button>
            @else
                <form action="{{ route('admin.users.toggleBlock', $user->id) }}" method="POST" class="inline">
                    @csrf
                    <button type="submit" 
                            class="px-4 py-2 border border-green-200 rounded-lg text-green-600 hover:bg-green-50 font-semibold text-sm transition-colors">
                        Unblock User
                    </button>
                </form>
            @endif

            {{-- Edit profile trigger --}}
            <button type="button" @click="editOpen = true"
                    class="px-4 py-2 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold text-sm transition-colors flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Edit User
            </button>
        </div>
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

    {{-- Layout columns --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {{-- Left Panel: User Profile & Actions --}}
        <div class="flex flex-col gap-6 lg:col-span-1">
            
            {{-- User Info Card --}}
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div class="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                    {{-- Persona circle avatar --}}
                    <div class="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-semibold text-xl flex items-center justify-center">
                        {{ substr($user->name ?? 'A', 0, 1) }}
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-900 text-lg leading-tight">{{ $user->name ?? '—' }}</h3>
                        <p class="text-sm text-slate-500 mt-0.5">{{ $user->phone }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-3">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    User Information
                </div>

                <div class="space-y-3.5 text-sm text-slate-600 mb-4">
                    <div>
                        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</div>
                        <div class="text-slate-800 font-medium mt-0.5">{{ $user->email ?? '—' }}</div>
                    </div>
                    <div>
                        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Join Date</div>
                        <div class="text-slate-800 font-medium mt-0.5">{{ $user->created_at?->format('M d, Y h:i A') }}</div>
                    </div>
                    <div>
                        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</div>
                        <div class="text-slate-800 font-medium mt-0.5">Total Orders: {{ $user->orders_count ?? $user->orders()->count() }}</div>
                    </div>
                </div>
            </div>

            {{-- User Actions Card --}}
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-4">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    User Actions
                </div>

                <div class="flex flex-col gap-2.5">
                    <div class="flex gap-2">
                        {{-- Block User Button --}}
                        <button type="button" @click="blockOpen = true" :disabled="{{ $user->is_blocked ? 'true' : 'false' }}"
                                class="flex-1 px-3 py-2 border border-red-200 rounded-lg text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Block User
                        </button>
                        
                        {{-- Unblock User Button --}}
                        <form action="{{ route('admin.users.toggleBlock', $user->id) }}" method="POST" class="flex-1 inline">
                            @csrf
                            <button type="submit" :disabled="{{ !$user->is_blocked ? 'true' : 'false' }}"
                                    class="w-full px-3 py-2 border border-green-200 rounded-lg text-green-600 font-semibold text-sm hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Unblock User
                            </button>
                        </form>
                    </div>

                    {{-- Push Notification Trigger --}}
                    <button type="button" @click="notifyOpen = true"
                            class="w-full px-3 py-2 border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition-colors rounded-lg flex items-center justify-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                        </svg>
                        Send Push Notification
                    </button>
                </div>
            </div>

            {{-- Addresses Card --}}
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-3">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Saved Addresses
                </div>

                @if($user->addresses->isEmpty())
                    <p class="text-xs text-slate-400 italic">No saved delivery addresses found.</p>
                @else
                    <div class="space-y-3">
                        @foreach($user->addresses as $address)
                            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-600 relative">
                                @if($address->is_default)
                                    <span class="absolute top-2.5 right-2.5 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">Default</span>
                                @endif
                                <div class="font-bold text-slate-800 mb-0.5">{{ $address->recipient_name }}</div>
                                <div>{{ $address->address_line }}</div>
                                <div>{{ $address->city }}, {{ $address->state }} - {{ $address->pincode }}</div>
                                <div class="mt-1 font-semibold text-slate-500">Phone: {{ $address->phone }}</div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

        </div>

        {{-- Right Panel: Order History Table --}}
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm lg:col-span-2 overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2 text-slate-900 font-bold text-base">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                    </svg>
                    Order History
                </div>
            </div>

            @if($orders->isEmpty())
                <div class="p-12 text-center text-slate-500">
                    <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p class="font-semibold text-slate-700">No order history</p>
                    <p class="text-sm text-slate-400 mt-0.5">This customer has not placed any orders yet.</p>
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th class="py-3 px-4">Order ID</th>
                                <th class="py-3 px-4">Date & Time</th>
                                <th class="py-3 px-4">Items</th>
                                <th class="py-3 px-4 text-right">Total Amount</th>
                                <th class="py-3 px-4 text-center">Payment Status</th>
                                <th class="py-3 px-4 text-center">Order Status</th>
                                <th class="py-3 px-4 text-center w-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                            @foreach($orders as $order)
                                <tr class="hover:bg-slate-50/50 transition-colors">
                                    <td class="py-3.5 px-4 font-semibold text-slate-900 font-mono">
                                        #BP{{ str_pad($order->display_order_id ?? $order->id, 5, '0', STR_PAD_LEFT) }}
                                    </td>
                                    <td class="py-3.5 px-4 text-slate-500 text-xs">
                                        {{ $order->created_at?->format('M d, Y h:i A') }}
                                    </td>
                                    <td class="py-3.5 px-4 text-xs font-medium">
                                        @php
                                            $printCount = $order->orderItems->where('item_type', 'print_job')->count();
                                            $prodCount = $order->orderItems->where('item_type', 'product')->count();
                                            $totalCount = $order->orderItems->count();
                                        @endphp
                                        @if($printCount > 0 && $prodCount > 0)
                                            {{ $totalCount }} ({{ $printCount }} Print, {{ $prodCount }} Product)
                                        @elseif($printCount > 0)
                                            {{ $totalCount }} ({{ $printCount == 1 ? 'Print Job' : 'Print Jobs' }})
                                        @elseif($prodCount > 0)
                                            {{ $totalCount }} ({{ $prodCount == 1 ? 'Product' : 'Products' }})
                                        @else
                                            —
                                        @endif
                                    </td>
                                    <td class="py-3.5 px-4 text-right font-bold text-slate-900">
                                        ₹{{ number_format($order->total_amount, 2) }}
                                    </td>
                                    <td class="py-3.5 px-4 text-center">
                                        @php
                                            $pColors = [
                                                'Paid'     => 'bg-green-50 text-green-700 border-green-200',
                                                'Pending'  => 'bg-amber-50 text-amber-700 border-amber-200',
                                                'Failed'   => 'bg-red-50 text-red-700 border-red-200',
                                                'Refunded' => 'bg-slate-100 text-slate-600 border-slate-200',
                                            ];
                                            $pDot = [
                                                'Paid'     => 'bg-green-600',
                                                'Pending'  => 'bg-amber-500',
                                                'Failed'   => 'bg-red-600',
                                                'Refunded' => 'bg-slate-500',
                                            ];
                                            $pStatus = $order->payment_status ?? 'Pending';
                                        @endphp
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold {{ $pColors[$pStatus] ?? $pColors['Pending'] }} border">
                                            <span class="w-1 h-1 rounded-full {{ $pDot[$pStatus] ?? $pDot['Pending'] }}"></span>
                                            {{ $pStatus }}
                                        </span>
                                    </td>
                                    <td class="py-3.5 px-4 text-center">
                                        @php
                                            $oColors = [
                                                'Placed'     => 'bg-blue-50 text-blue-700 border-blue-200',
                                                'Processing' => 'bg-amber-50 text-amber-700 border-amber-200',
                                                'Dispatched' => 'bg-indigo-50 text-indigo-700 border-indigo-200',
                                                'Delivered'  => 'bg-green-50 text-green-700 border-green-200',
                                                'Cancelled'  => 'bg-red-50 text-red-700 border-red-200',
                                            ];
                                            $oStatus = $order->order_status ?? 'Placed';
                                        @endphp
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold {{ $oColors[$oStatus] ?? $oColors['Placed'] }} border">
                                            {{ $oStatus }}
                                        </span>
                                    </td>
                                    <td class="py-3.5 px-4 text-center">
                                        <a href="{{ route('admin.orders.show', $order->id) }}" 
                                           class="px-2 py-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors">
                                            View
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                {{-- Pagination --}}
                <div class="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div>
                        Showing {{ $orders->firstItem() }} to {{ $orders->lastItem() }} of {{ $orders->total() }} orders
                    </div>
                    <div>
                        {{ $orders->links() }}
                    </div>
                </div>
            @endif

        </div>

    </div>

    {{-- Edit User Modal --}}
    <div x-show="editOpen" 
         class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" 
         x-cloak>
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="editOpen = false"></div>

        <div class="bg-white rounded-xl shadow-xl border border-slate-100 max-w-md w-full p-6 relative z-10 transform transition-all">
            <h3 class="text-lg font-bold text-slate-900 mb-4">Edit User Profile</h3>

            <form action="{{ route('admin.users.update', $user->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="space-y-4 mb-6">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Name</label>
                        <input type="text" name="name" value="{{ old('name', $user->name) }}" required
                               class="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email</label>
                        <input type="email" name="email" value="{{ old('email', $user->email) }}"
                               class="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone (Immutable)</label>
                        <input type="text" value="{{ $user->phone }}" disabled
                               class="w-full px-3.5 py-2 border border-slate-100 bg-slate-100 text-slate-400 rounded-lg text-sm cursor-not-allowed">
                    </div>
                </div>

                <div class="flex items-center gap-3 justify-end">
                    <button type="button" 
                            class="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
                            @click="editOpen = false">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>

    {{-- Send Notification Modal --}}
    <div x-show="notifyOpen" 
         class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" 
         x-cloak>
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="notifyOpen = false"></div>

        <div class="bg-white rounded-xl shadow-xl border border-slate-100 max-w-md w-full p-6 relative z-10 transform transition-all">
            <h3 class="text-lg font-bold text-slate-900 mb-4">Send Push Notification</h3>
            <p class="text-xs text-slate-500 mb-4">Dispatches a mock push notification alert to {{ $user->name ?? $user->phone }} and saves a notification record to the database.</p>

            <form action="{{ route('admin.users.notify', $user->id) }}" method="POST">
                @csrf

                <div class="space-y-4 mb-6">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Notification Title</label>
                        <input type="text" name="title" required placeholder="e.g. Special Promotion just for you!"
                               class="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Notification Body</label>
                        <textarea name="body" required rows="4" placeholder="Type notification content here..."
                                  class="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"></textarea>
                    </div>
                </div>

                <div class="flex items-center gap-3 justify-end">
                    <button type="button" 
                            class="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors"
                            @click="notifyOpen = false">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                        Send Notification
                    </button>
                </div>
            </form>
        </div>
    </div>

    {{-- Block Modal --}}
    <div x-show="blockOpen" 
         class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" 
         x-cloak>
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="blockOpen = false"></div>

        <div class="bg-white rounded-xl shadow-xl border border-slate-100 max-w-sm w-full p-6 relative z-10 text-center transform transition-all">
            <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" @click="blockOpen = false">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>

            <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            </div>

            <h3 class="text-lg font-bold text-slate-900 mb-2">Block User</h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
                Are you sure you want to block <span class="font-semibold text-slate-900">{{ $user->name ?? '—' }}</span> ({{ $user->phone }})? <br>
                This user will not be able to login.
            </p>

            <div class="flex items-center gap-3 justify-center">
                <button type="button" 
                        class="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors flex-1"
                        @click="blockOpen = false">
                    Cancel
                </button>
                <form :action="blockUrl" method="POST" class="flex-1">
                    @csrf
                    <button type="submit" 
                            class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors">
                        Yes, Block
                    </button>
                </form>
            </div>
        </div>
    </div>

</div>
@endsection
