<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\Setting;

class SettingsController extends Controller
{
    /**
     * Show the settings page with tabs.
     */
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'print_pricing');
        $allSettings = SettingsService::all();
        $settings = collect($allSettings)->map(function ($setting) {
            return $setting['value'];
        })->toArray();
        
        return view('admin.settings.index', compact('tab', 'settings'));
    }

    /**
     * Save settings for the active tab.
     */
    public function save(Request $request)
    {
        $tab = $request->input('tab', 'print_pricing');
        $adminId = Auth::guard('admin')->id();

        if ($tab === 'print_pricing') {
            $validated = $request->validate([
                'bw_price_per_page' => 'required|numeric|min:0.01|max:999.99',
                'color_multiplier' => 'required|numeric|min:1.0|max:99.99',
                'double_side_charge' => 'required|numeric|min:0|max:99.99',
                'binding_fee' => 'required|numeric|min:0|max:999.99',
                'paper_a4_surcharge' => 'nullable|numeric|min:0|max:999.99',
                'paper_a3_surcharge' => 'nullable|numeric|min:0|max:999.99',
                'paper_premium_surcharge' => 'nullable|numeric|min:0|max:999.99',
                'paper_glossy_surcharge' => 'nullable|numeric|min:0|max:999.99',
                'lamination_fee' => 'nullable|numeric|min:0|max:9999.99',
                'spiral_binding_fee' => 'nullable|numeric|min:0|max:9999.99',
                'hard_binding_fee' => 'nullable|numeric|min:0|max:9999.99',
            ]);

            SettingsService::updateSettings($validated, $adminId);

        } elseif ($tab === 'delivery') {
            $validated = $request->validate([
                'delivery_fee' => 'required|numeric|min:0|max:9999.99',
                'free_delivery_threshold' => 'required|numeric|min:0',
                'minimum_order_amount' => 'required|numeric|min:0',
                'is_delivery_enabled' => 'nullable|boolean',
                'estimated_delivery_days' => 'required|integer|min:1|max:30',
            ]);

            // Transform checkbox to boolean string
            $validated['is_delivery_enabled'] = $request->has('is_delivery_enabled') ? 'true' : 'false';

            // Additional cross-field validation
            if ($validated['free_delivery_threshold'] <= $validated['minimum_order_amount']) {
                return back()->withErrors(['free_delivery_threshold' => 'Free delivery threshold must be greater than minimum order amount.'])->withInput();
            }

            SettingsService::updateSettings($validated, $adminId);

        } elseif ($tab === 'business_info') {
            $validated = $request->validate([
                'business_name' => 'required|string|max:100',
                'gst_number' => ['nullable', 'string', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/'],
                'business_logo_url' => 'nullable|url',
                'business_address' => 'required|string|max:500',
                'business_phone' => 'required|string|max:20',
                'support_phone' => 'nullable|string|max:20',
                'support_email' => 'nullable|email',
                'whatsapp_number' => 'nullable|string|max:20',
                'terms_url' => 'nullable|url',
                'privacy_policy_url' => 'nullable|url',
                'refund_policy_url' => 'nullable|url',
                'working_hours' => 'nullable|string|max:200',
                'holiday_notice' => 'nullable|string|max:500',
            ]);

            SettingsService::updateSettings($validated, $adminId);
        }

        return redirect()->route('admin.settings.index', ['tab' => $tab])
                         ->with('success', 'Settings saved successfully.');
    }

    /**
     * Show the admin account management page.
     */
    public function account()
    {
        $admin = Auth::guard('admin')->user();
        return view('admin.settings.account', compact('admin'));
    }

    /**
     * Update admin profile information.
     */
    public function updateProfile(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('admins')->ignore($admin->id)],
            'current_password_for_email' => 'required_with:email|string',
        ]);

        if ($request->email !== $admin->email) {
            if (!Hash::check($request->current_password_for_email, $admin->password)) {
                return back()->withErrors(['current_password_for_email' => 'Current password is required and must be correct to change email.'])->withInput();
            }
        }

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];
        $admin->save();

        return redirect()->route('admin.settings.account')->with('success', 'Profile updated successfully.');
    }

    /**
     * Update admin password.
     */
    public function updatePassword(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed|different:current_password',
        ]);

        if (!Hash::check($request->current_password, $admin->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.'])->withInput();
        }

        // Additional complexity validation could be done here or in a custom rule
        if (!preg_match('/[A-Z]/', $request->new_password) || !preg_match('/[0-9]/', $request->new_password)) {
             return back()->withErrors(['new_password' => 'New password must contain at least one uppercase letter and one number.'])->withInput();
        }

        $admin->password = Hash::make($request->new_password);
        $admin->save();

        return redirect()->route('admin.settings.account')->with('success', 'Password updated successfully.');
    }
}
