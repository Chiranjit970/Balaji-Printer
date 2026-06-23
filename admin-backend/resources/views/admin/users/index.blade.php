@extends('admin.layout.app')
@section('title', 'Users')

@section('content')
<div x-data="{ 
    modalOpen: false, 
    blockUrl: '', 
    userName: '', 
    userPhone: '' 
}">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Users</h1>
        </div>
        <button class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-not-allowed opacity-60" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add User
        </button>
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

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        @foreach([
            ['label' => 'Total Users',     'value' => $summary['total'],          'color' => 'text-slate-900'],
            ['label' => 'Active Users',    'value' => $summary['active'],         'color' => 'text-green-600'],
            ['label' => 'Blocked Users',   'value' => $summary['blocked'],        'color' => 'text-red-600'],
            ['label' => 'New This Month',  'value' => $summary['new_this_month'], 'color' => 'text-blue-600'],
        ] as $kpi)
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ $kpi['label'] }}</p>
                <p class="text-2xl font-bold {{ $kpi['color'] }} mt-2">{{ $kpi['value'] }}</p>
            </div>
        @endforeach
    </div>

    {{-- Filters Toolbar --}}
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
        <form method="GET" action="{{ route('admin.users.index') }}" class="flex flex-col md:flex-row items-stretch md:items-end gap-3">
            <div class="flex-1">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Search</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </span>
                    <input type="text" name="search" value="{{ $filters['search'] ?? '' }}" placeholder="Search by name, phone or email..."
                           class="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                </div>
            </div>

            <div class="w-full md:w-44">
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                <select name="status" class="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors">
                    <option value="">All Status</option>
                    <option value="0" {{ ($filters['status'] ?? '') === '0' ? 'selected' : '' }}>Active</option>
                    <option value="1" {{ ($filters['status'] ?? '') === '1' ? 'selected' : '' }}>Blocked</option>
                </select>
            </div>

            <div class="flex items-center gap-2">
                <a href="{{ route('admin.users.index') }}" class="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center flex-1 md:flex-none">
                    Reset
                </a>
                <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors text-center flex-1 md:flex-none flex items-center justify-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                    </svg>
                    Filter
                </button>
            </div>
        </form>
    </div>

    {{-- Users Table --}}
    @if($users->isEmpty())
        <div class="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <div class="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            </div>
            <h3 class="text-base font-semibold text-slate-900">No users found</h3>
            <p class="text-sm text-slate-500 mt-1 max-w-xs mx-auto">No registered user accounts match the current search filters.</p>
        </div>
    @else
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th class="py-3 px-4 w-12 text-center">#</th>
                            <th class="py-3 px-4">Name</th>
                            <th class="py-3 px-4">Phone</th>
                            <th class="py-3 px-4">Join Date</th>
                            <th class="py-3 px-4">Status</th>
                            <th class="py-3 px-4 text-right w-52">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                        @foreach($users as $user)
                            <tr class="hover:bg-slate-50/50 transition-colors">
                                <td class="py-3.5 px-4 text-center text-slate-400 font-semibold">
                                    {{ ($users->currentPage() - 1) * $users->perPage() + $loop->iteration }}
                                </td>
                                <td class="py-3.5 px-4 font-semibold text-slate-900">
                                    {{ $user->name ?? '—' }}
                                    @if($user->email)
                                        <div class="text-xs text-slate-400 font-normal mt-0.5">{{ $user->email }}</div>
                                    @endif
                                </td>
                                <td class="py-3.5 px-4 font-medium text-slate-700">
                                    {{ $user->phone }}
                                </td>
                                <td class="py-3.5 px-4 text-slate-500">
                                    {{ $user->created_at?->format('M d, Y h:i A') }}
                                </td>
                                <td class="py-3.5 px-4">
                                    @if(!$user->is_blocked)
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                            <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                            Active
                                        </span>
                                    @else
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                            <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                            Blocked
                                        </span>
                                    @endif
                                </td>
                                <td class="py-3.5 px-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.users.show', $user->id) }}" 
                                           class="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                            View Details
                                        </a>

                                        @if(!$user->is_blocked)
                                            <button type="button"
                                                    @click="modalOpen = true; blockUrl = '{{ route('admin.users.toggleBlock', $user->id) }}'; userName = '{{ addslashes($user->name ?? '—') }}'; userPhone = '{{ $user->phone }}';"
                                                    class="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                                                Block
                                            </button>
                                        @else
                                            <form action="{{ route('admin.users.toggleBlock', $user->id) }}" method="POST" class="inline">
                                                @csrf
                                                <button type="submit" class="px-3 py-1.5 text-xs font-semibold text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                                                    Unblock
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            {{-- Footer Pagination --}}
            <div class="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div>
                    Showing {{ $users->firstItem() }} to {{ $users->lastItem() }} of {{ $users->total() }} users
                </div>

                <div class="flex items-center gap-4">
                    {{-- Per Page Selector --}}
                    <form method="GET" action="{{ route('admin.users.index') }}" class="flex items-center gap-1.5">
                        @if(request('search')) <input type="hidden" name="search" value="{{ request('search') }}"> @endif
                        @if(request('status')) <input type="hidden" name="status" value="{{ request('status') }}"> @endif
                        
                        <span>Show</span>
                        <select name="per_page" onchange="this.form.submit()" class="py-1 px-2 border border-slate-200 rounded bg-white text-xs font-semibold focus:outline-none focus:border-blue-600 transition-colors">
                            <option value="10" {{ ($filters['per_page'] ?? 10) == 10 ? 'selected' : '' }}>10</option>
                            <option value="25" {{ ($filters['per_page'] ?? 10) == 25 ? 'selected' : '' }}>25</option>
                            <option value="50" {{ ($filters['per_page'] ?? 10) == 50 ? 'selected' : '' }}>50</option>
                        </select>
                        <span>per page</span>
                    </form>

                    <div>
                        {{ $users->links() }}
                    </div>
                </div>
            </div>
        </div>
    @endif

    {{-- Block Confirmation Modal --}}
    <div x-show="modalOpen" 
         class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" 
         x-cloak>
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
             @click="modalOpen = false"></div>

        <!-- Modal Container -->
        <div class="bg-white rounded-xl shadow-xl border border-slate-100 max-w-sm w-full p-6 relative z-10 text-center transform transition-all">
            <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" @click="modalOpen = false">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>

            <!-- Warning Icon -->
            <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            </div>

            <h3 class="text-lg font-bold text-slate-900 mb-2">Block User</h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
                Are you sure you want to block <span class="font-semibold text-slate-900" x-text="userName"></span> (<span class="font-semibold text-slate-900" x-text="userPhone"></span>)? <br>
                This user will not be able to login.
            </p>

            <div class="flex items-center gap-3 justify-center">
                <button type="button" 
                        class="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors flex-1"
                        @click="modalOpen = false">
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
