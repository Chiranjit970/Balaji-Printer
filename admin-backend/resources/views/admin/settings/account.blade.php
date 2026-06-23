@extends('admin.layout.app')

@section('title', 'Admin Account - Balaji Printers')

@section('content')
<div class="mb-8">
  <h2 class="text-2xl font-bold text-slate-900">Manage Your Account</h2>
  <p class="text-slate-500 mt-1">Update your profile details and security settings.</p>
</div>

@if(session('success'))
<div class="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  {{ session('success') }}
</div>
@endif

@if($errors->any())
<div class="mb-6 bg-red-50 text-red-700 p-4 rounded-lg">
  <ul class="list-disc pl-5">
    @foreach($errors->all() as $error)
      <li>{{ $error }}</li>
    @endforeach
  </ul>
</div>
@endif

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
  <!-- Profile Details -->
  <div class="lg:col-span-2">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h3 class="font-semibold text-lg text-slate-800">Profile Information</h3>
      </div>
      <div class="p-6">
        <form action="{{ route('admin.settings.account.updateProfile') }}" method="POST" class="space-y-6">
          @csrf
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" value="{{ old('name', $admin->name) }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" name="email" value="{{ old('email', $admin->email) }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>
          
          <div class="pt-4 border-t border-slate-100">
            <p class="text-sm text-slate-500 mb-3">If you are changing your email address, please provide your current password.</p>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Current Password (For email changes)</label>
              <input type="password" name="current_password_for_email" class="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>
          
          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" class="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-6 rounded-lg transition shadow-sm">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Password -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h3 class="font-semibold text-lg text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Security Settings
        </h3>
      </div>
      <div class="p-6">
        <form action="{{ route('admin.settings.account.updatePassword') }}" method="POST" class="space-y-6">
          @csrf
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input type="password" name="current_password" class="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input type="password" name="new_password" class="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input type="password" name="new_password_confirmation" class="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          
          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-sm">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Session Info & Logout -->
  <div class="lg:col-span-1">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 bg-red-50">
        <h3 class="font-semibold text-lg text-red-700">Account Access</h3>
      </div>
      <div class="p-6">
        <p class="text-sm text-slate-600 mb-6">Logging out will clear your current session. You will need to sign in again to access the admin portal.</p>
        
        <form action="{{ route('admin.logout') }}" method="POST">
          @csrf
          <button type="submit" class="w-full bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium py-2.5 px-6 rounded-lg transition flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Secure Logout
          </button>
        </form>
      </div>
    </div>
  </div>

</div>
@endsection
