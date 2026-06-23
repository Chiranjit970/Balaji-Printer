@extends('admin.layout.app')

@section('title', 'Settings - Balaji Printers')

@section('content')
<div class="mb-8">
  <h2 class="text-2xl font-bold text-slate-900">Platform Settings</h2>
  <p class="text-slate-500 mt-1">Manage global pricing, delivery rules, and business information.</p>
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

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" x-data="{ activeTab: '{{ $tab }}' }">
  
  <!-- Tabs Header -->
  <div class="flex border-b border-slate-200 px-4 pt-2">
    <button @click="activeTab = 'print_pricing'" :class="{'text-blue-600 border-b-2 border-blue-600': activeTab === 'print_pricing', 'text-slate-500 hover:text-slate-700': activeTab !== 'print_pricing'}" class="px-5 py-3 font-medium transition flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect></svg>
      Print Pricing
    </button>
    <button @click="activeTab = 'delivery'" :class="{'text-blue-600 border-b-2 border-blue-600': activeTab === 'delivery', 'text-slate-500 hover:text-slate-700': activeTab !== 'delivery'}" class="px-5 py-3 font-medium transition flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
      Delivery Rules
    </button>
    <button @click="activeTab = 'business_info'" :class="{'text-blue-600 border-b-2 border-blue-600': activeTab === 'business_info', 'text-slate-500 hover:text-slate-700': activeTab !== 'business_info'}" class="px-5 py-3 font-medium transition flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      Business Info
    </button>
  </div>

  <!-- Tab Content: Print Pricing -->
  <div x-show="activeTab === 'print_pricing'" class="p-8" style="display: none;">
    <form action="{{ route('admin.settings.save') }}" method="POST">
      @csrf
      <input type="hidden" name="tab" value="print_pricing">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Base Pricing -->
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 class="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Base Pricing
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">B&W Price (per page) ₹</label>
              <input type="number" step="0.01" name="bw_price_per_page" value="{{ old('bw_price_per_page', $settings['bw_price_per_page'] ?? '2.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Color Price Multiplier</label>
              <input type="number" step="0.01" name="color_multiplier" value="{{ old('color_multiplier', $settings['color_multiplier'] ?? '5.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              <p class="text-xs text-slate-500 mt-1">If B&W is ₹2 and multiplier is 5, Color is ₹10.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Double Side Charge (Add to Base ₹)</label>
              <input type="number" step="0.01" name="double_side_charge" value="{{ old('double_side_charge', $settings['double_side_charge'] ?? '0.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
          </div>
        </div>

        <!-- Paper Size & Quality Surcharges -->
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 class="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Paper Surcharges (Added per page)
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">A4 Size Surcharge (₹)</label>
              <input type="number" step="0.01" name="paper_a4_surcharge" value="{{ old('paper_a4_surcharge', $settings['paper_a4_surcharge'] ?? '0.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">A3 Size Surcharge (₹)</label>
              <input type="number" step="0.01" name="paper_a3_surcharge" value="{{ old('paper_a3_surcharge', $settings['paper_a3_surcharge'] ?? '2.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Premium Paper Surcharge (₹)</label>
              <input type="number" step="0.01" name="paper_premium_surcharge" value="{{ old('paper_premium_surcharge', $settings['paper_premium_surcharge'] ?? '1.50') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Glossy Paper Surcharge (₹)</label>
              <input type="number" step="0.01" name="paper_glossy_surcharge" value="{{ old('paper_glossy_surcharge', $settings['paper_glossy_surcharge'] ?? '3.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
          </div>
        </div>

        <!-- Binding & Finishing -->
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 md:col-span-2">
          <h3 class="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Binding & Finishing (Fixed Fee)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Standard Binding Fee (₹)</label>
              <input type="number" step="0.01" name="binding_fee" value="{{ old('binding_fee', $settings['binding_fee'] ?? '10.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Spiral Binding Fee (₹)</label>
              <input type="number" step="0.01" name="spiral_binding_fee" value="{{ old('spiral_binding_fee', $settings['spiral_binding_fee'] ?? '40.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Hard Binding Fee (₹)</label>
              <input type="number" step="0.01" name="hard_binding_fee" value="{{ old('hard_binding_fee', $settings['hard_binding_fee'] ?? '150.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Lamination Fee (per item ₹)</label>
              <input type="number" step="0.01" name="lamination_fee" value="{{ old('lamination_fee', $settings['lamination_fee'] ?? '10.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
          </div>
        </div>

      </div>

      <div class="mt-8 flex justify-end">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          Save Print Pricing
        </button>
      </div>
    </form>
  </div>

  <!-- Tab Content: Delivery -->
  <div x-show="activeTab === 'delivery'" class="p-8" style="display: none;">
    <form action="{{ route('admin.settings.save') }}" method="POST" class="max-w-2xl">
      @csrf
      <input type="hidden" name="tab" value="delivery">
      <div class="space-y-6">
        
        <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <input type="checkbox" name="is_delivery_enabled" id="is_delivery_enabled" value="true" {{ (old('is_delivery_enabled', $settings['is_delivery_enabled'] ?? 'true') === 'true' || old('is_delivery_enabled', $settings['is_delivery_enabled'] ?? true) === true) ? 'checked' : '' }} class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
          <label for="is_delivery_enabled" class="font-medium text-blue-900 cursor-pointer">Enable Home Delivery Service</label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Standard Delivery Fee (₹)</label>
            <input type="number" step="0.01" name="delivery_fee" value="{{ old('delivery_fee', $settings['delivery_fee'] ?? '50.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Free Delivery Threshold (₹)</label>
            <input type="number" step="0.01" name="free_delivery_threshold" value="{{ old('free_delivery_threshold', $settings['free_delivery_threshold'] ?? '500.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <p class="text-xs text-slate-500 mt-1">Orders above this amount get free delivery.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Minimum Order Amount (₹)</label>
            <input type="number" step="0.01" name="minimum_order_amount" value="{{ old('minimum_order_amount', $settings['minimum_order_amount'] ?? '50.00') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <p class="text-xs text-slate-500 mt-1">Customers cannot checkout below this amount.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Estimated Delivery Days</label>
            <input type="number" name="estimated_delivery_days" value="{{ old('estimated_delivery_days', $settings['estimated_delivery_days'] ?? '2') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 flex justify-end">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm">
            Save Delivery Rules
          </button>
        </div>
      </div>
    </form>
  </div>

  <!-- Tab Content: Business Info -->
  <div x-show="activeTab === 'business_info'" class="p-8" style="display: none;">
    <form action="{{ route('admin.settings.save') }}" method="POST" class="max-w-3xl">
      @csrf
      <input type="hidden" name="tab" value="business_info">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
          <input type="text" name="business_name" value="{{ old('business_name', $settings['business_name'] ?? 'Balaji Printers') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">GST Number (Optional)</label>
          <input type="text" name="gst_number" value="{{ old('gst_number', $settings['gst_number'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Business Phone</label>
          <input type="text" name="business_phone" value="{{ old('business_phone', $settings['business_phone'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Support Phone</label>
          <input type="text" name="support_phone" value="{{ old('support_phone', $settings['support_phone'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
          <input type="email" name="support_email" value="{{ old('support_email', $settings['support_email'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
          <input type="text" name="whatsapp_number" value="{{ old('whatsapp_number', $settings['whatsapp_number'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">Business Address</label>
          <textarea name="business_address" rows="2" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">{{ old('business_address', $settings['business_address'] ?? '') }}</textarea>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">Working Hours</label>
          <input type="text" name="working_hours" value="{{ old('working_hours', $settings['working_hours'] ?? 'Mon-Sat: 9:00 AM - 8:00 PM | Sun: Closed') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">Holiday Notice (Banner Text)</label>
          <input type="text" name="holiday_notice" value="{{ old('holiday_notice', $settings['holiday_notice'] ?? '') }}" placeholder="e.g. Shop is closed for Diwali from 10th to 12th Nov." class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <p class="text-xs text-slate-500 mt-1">Leave empty to hide banner in app.</p>
        </div>

        <div class="md:col-span-2">
           <label class="block text-sm font-medium text-slate-700 mb-1">Business Logo URL</label>
           <input type="url" name="business_logo_url" value="{{ old('business_logo_url', $settings['business_logo_url'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>

        <div class="md:col-span-2">
           <label class="block text-sm font-medium text-slate-700 mb-1">Terms URL</label>
           <input type="url" name="terms_url" value="{{ old('terms_url', $settings['terms_url'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
        
        <div class="md:col-span-2">
           <label class="block text-sm font-medium text-slate-700 mb-1">Privacy Policy URL</label>
           <input type="url" name="privacy_policy_url" value="{{ old('privacy_policy_url', $settings['privacy_policy_url'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
        
        <div class="md:col-span-2">
           <label class="block text-sm font-medium text-slate-700 mb-1">Refund Policy URL</label>
           <input type="url" name="refund_policy_url" value="{{ old('refund_policy_url', $settings['refund_policy_url'] ?? '') }}" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
        
      </div>

      <div class="mt-8 pt-4 border-t border-slate-200 flex justify-end">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm">
          Save Business Info
        </button>
      </div>
    </form>
  </div>

</div>
@endsection
