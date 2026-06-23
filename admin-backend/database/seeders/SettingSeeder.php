<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            // Print Pricing
            [
                'key' => 'bw_price_per_page',
                'value' => '1.50',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Black & White (Per Page)',
                'description' => 'Base price for black & white per page',
            ],
            [
                'key' => 'color_multiplier',
                'value' => '2.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Color Multiplier',
                'description' => 'Multiplier applied on base price for color pages',
            ],
            [
                'key' => 'double_side_charge',
                'value' => '0.50',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Double Side (Per Page)',
                'description' => 'Additional charge for double side printing',
            ],
            [
                'key' => 'binding_fee',
                'value' => '20.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Binding Fees',
                'description' => 'Standard binding charge (per order)',
            ],
            [
                'key' => 'paper_a4_surcharge',
                'value' => '0.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'A4 Size (Per Page)',
                'description' => 'Additional charge for A4 paper (0 = no surcharge)',
            ],
            [
                'key' => 'paper_a3_surcharge',
                'value' => '0.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'A3 Size (Per Page)',
                'description' => 'Additional charge for A3 paper',
            ],
            [
                'key' => 'paper_premium_surcharge',
                'value' => '1.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Premium Paper (Per Page)',
                'description' => 'Additional charge for premium paper',
            ],
            [
                'key' => 'paper_glossy_surcharge',
                'value' => '1.50',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Glossy Paper (Per Page)',
                'description' => 'Additional charge for glossy paper',
            ],
            [
                'key' => 'lamination_fee',
                'value' => '2.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Lamination (Per Page)',
                'description' => 'Charge per page for lamination',
            ],
            [
                'key' => 'spiral_binding_fee',
                'value' => '15.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Spiral Binding (Per Order)',
                'description' => 'Per-order charge for spiral binding',
            ],
            [
                'key' => 'hard_binding_fee',
                'value' => '40.00',
                'type' => 'float',
                'group' => 'print_pricing',
                'label' => 'Hard Binding (Per Order)',
                'description' => 'Per-order charge for hard binding',
            ],

            // Delivery
            [
                'key' => 'delivery_fee',
                'value' => '40.00',
                'type' => 'float',
                'group' => 'delivery',
                'label' => 'Standard Delivery Fee',
                'description' => 'Charged on orders below free delivery threshold',
            ],
            [
                'key' => 'free_delivery_threshold',
                'value' => '500.00',
                'type' => 'float',
                'group' => 'delivery',
                'label' => 'Free Delivery Threshold',
                'description' => 'Orders above this amount get free delivery',
            ],
            [
                'key' => 'minimum_order_amount',
                'value' => '50.00',
                'type' => 'float',
                'group' => 'delivery',
                'label' => 'Minimum Order Amount',
                'description' => 'Minimum cart value required to place an order',
            ],
            [
                'key' => 'is_delivery_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'delivery',
                'label' => 'Delivery Enabled',
                'description' => 'Disable to pause all deliveries temporarily',
            ],
            [
                'key' => 'estimated_delivery_days',
                'value' => '2',
                'type' => 'integer',
                'group' => 'delivery',
                'label' => 'Estimated Delivery Time',
                'description' => 'Shown to customers at checkout',
            ],

            // Business
            [
                'key' => 'business_name',
                'value' => 'Balaji Printers',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Business Name',
                'description' => 'Appears on invoices and customer receipts',
            ],
            [
                'key' => 'gst_number',
                'value' => '',
                'type' => 'string',
                'group' => 'business',
                'label' => 'GST Number',
                'description' => 'Shown on tax invoices',
            ],
            [
                'key' => 'business_logo_url',
                'value' => '',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Business Logo URL',
                'description' => 'Shown in app header and invoices',
            ],
            [
                'key' => 'business_address',
                'value' => 'Balaji Printers Main Office',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Business Address',
                'description' => 'Full address shown in Help & Support and invoices',
            ],
            [
                'key' => 'business_phone',
                'value' => '+919876543210',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Primary Phone',
                'description' => 'Main contact number shown to customers',
            ],
            [
                'key' => 'support_phone',
                'value' => '+919876543211',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Support Phone',
                'description' => 'Support number shown in Help section',
            ],
            [
                'key' => 'support_email',
                'value' => 'support@balajiprinters.com',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Support Email',
                'description' => 'Support email shown to customers',
            ],
            [
                'key' => 'whatsapp_number',
                'value' => '+919876543210',
                'type' => 'string',
                'group' => 'business',
                'label' => 'WhatsApp Number',
                'description' => 'For WhatsApp support (optional)',
            ],
            [
                'key' => 'terms_url',
                'value' => 'https://balajiprinters.com/terms',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Terms & Conditions URL',
                'description' => 'Link shown on registration and checkout',
            ],
            [
                'key' => 'privacy_policy_url',
                'value' => 'https://balajiprinters.com/privacy',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Privacy Policy URL',
                'description' => 'Link shown in app settings',
            ],
            [
                'key' => 'refund_policy_url',
                'value' => 'https://balajiprinters.com/refunds',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Refund Policy URL',
                'description' => 'Link shown in order details and help',
            ],
            [
                'key' => 'working_hours',
                'value' => 'Monday - Saturday: 9:00 AM - 8:00 PM',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Working Hours Text',
                'description' => 'Shown in Help & Support screen',
            ],
            [
                'key' => 'holiday_notice',
                'value' => '',
                'type' => 'string',
                'group' => 'business',
                'label' => 'Holiday Notice',
                'description' => 'Optional message shown during holidays',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'group' => $setting['group'],
                    'label' => $setting['label'],
                    'description' => $setting['description'],
                ]
            );
        }
    }
}
