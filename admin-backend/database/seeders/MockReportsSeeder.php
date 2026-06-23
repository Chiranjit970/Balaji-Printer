<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PrintJob;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MockReportsSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks for clean seeding
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Truncate tables to prevent duplicates
        User::truncate();
        Address::truncate();
        Order::truncate();
        OrderItem::truncate();
        Payment::truncate();
        PrintJob::truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create Users
        $usersData = [
            [
                'name' => 'Rohit Sharma',
                'phone' => '9876543210',
                'email' => 'rohit.sharma@email.com',
                'is_blocked' => false,
            ],
            [
                'name' => 'Neha Patel',
                'phone' => '9876512345',
                'email' => 'neha.patel@email.com',
                'is_blocked' => false,
            ],
            [
                'name' => 'Aarav Mehta',
                'phone' => '9123456789',
                'email' => 'aarav.mehta@email.com',
                'is_blocked' => false,
            ],
            [
                'name' => 'Priya Nair',
                'phone' => '9987654321',
                'email' => 'priya.nair@email.com',
                'is_blocked' => false,
            ],
            [
                'name' => 'Vikram Singh',
                'phone' => '9654321098',
                'email' => 'vikram.singh@email.com',
                'is_blocked' => true,
            ],
            [
                'name' => 'Anjali Verma',
                'phone' => '9832165478',
                'email' => 'anjali.verma@email.com',
                'is_blocked' => false,
            ],
            [
                'name' => 'Manish Karthik',
                'phone' => '9001122334',
                'email' => 'manish.karthik@email.com',
                'is_blocked' => true,
            ],
        ];

        $users = [];
        foreach ($usersData as $uData) {
            $users[] = User::create($uData);
        }

        // Add addresses to Rohit Sharma
        $rohit = $users[0];
        Address::create([
            'user_id' => $rohit->id,
            'label' => 'Home',
            'recipient_name' => 'Rohit Sharma',
            'line1' => 'Balaji Printers',
            'line2' => 'Shop 4, MG Road',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'pincode' => '400001',
            'phone' => '9876543210',
            'is_default' => true,
        ]);
        Address::create([
            'user_id' => $rohit->id,
            'label' => 'Office',
            'recipient_name' => 'Rohit Sharma (Office)',
            'line1' => 'Tech Hub',
            'line2' => 'Wing B, 8th Floor',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'pincode' => '400013',
            'phone' => '9876543210',
            'is_default' => false,
        ]);

        // Add addresses to others
        for ($i = 1; $i < count($users); $i++) {
            Address::create([
                'user_id' => $users[$i]->id,
                'label' => 'Home',
                'recipient_name' => $users[$i]->name,
                'line1' => 'House No. ' . rand(10, 150),
                'line2' => 'Park Lane',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'pincode' => '400002',
                'phone' => $users[$i]->phone,
                'is_default' => true,
            ]);
        }

        // Product category IDs from CategorySeeder:
        // 'visiting-cards', 'flyers', 'banners', 'stationery'
        
        // Let's create orders & payments for the past 7 days to populate the reports
        $statuses = ['Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];
        $paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
        
        $today = Carbon::today();

        // We will seed 186 orders total to match the reports screenshot (or a good distribution)
        // Let's loop over past 7 days and insert orders
        $orderCount = 0;
        
        // Define daily distributions for the line chart (totaling around 186 orders)
        $dailyOrders = [
            6 => 24, // 6 days ago
            5 => 28, // 5 days ago
            4 => 35, // 4 days ago
            3 => 22, // 3 days ago
            2 => 27, // 2 days ago
            1 => 21, // 1 day ago
            0 => 29, // today
        ];

        foreach ($dailyOrders as $daysAgo => $countForDay) {
            $dayDate = $today->copy()->subDays($daysAgo);
            
            for ($o = 0; $o < $countForDay; $o++) {
                $user = $users[array_rand($users)];
                $address = $user->addresses()->first();
                
                // Set statuses with a realistic distribution:
                // Paid: 80%, Pending: 10%, Failed: 5%, Refunded: 5%
                $rand = rand(1, 100);
                if ($rand <= 80) {
                    $pStatus = 'Paid';
                    $oStatus = $statuses[array_rand(['Processing', 'Dispatched', 'Delivered'])];
                } elseif ($rand <= 90) {
                    $pStatus = 'Pending';
                    $oStatus = 'Placed';
                } elseif ($rand <= 95) {
                    $pStatus = 'Failed';
                    $oStatus = 'Cancelled';
                } else {
                    $pStatus = 'Refunded';
                    $oStatus = 'Cancelled';
                }

                // Subtotal and totals
                $subtotal = rand(100, 1500);
                $delivery = rand(0, 1) * 50;
                $tax = round($subtotal * 0.18, 2);
                $total = $subtotal + $delivery + $tax;

                $order = Order::create([
                    'display_order_id' => $orderCount + 1000,
                    'user_id' => $user->id,
                    'address_id' => $address ? $address->id : null,
                    'order_status' => $oStatus,
                    'payment_status' => $pStatus,
                    'subtotal' => $subtotal,
                    'delivery_charges' => $delivery,
                    'tax' => $tax,
                    'total_amount' => $total,
                    'payment_method' => 'Razorpay',
                    'created_at' => $dayDate->copy()->addMinutes(rand(10, 1400)),
                    'updated_at' => $dayDate,
                ]);

                // Create Order Items (Product or Print Job)
                $itemType = rand(1, 10) <= 7 ? 'product' : 'print_job';
                
                if ($itemType === 'product') {
                    $prodId = 'prod-00' . rand(1, 4);
                    OrderItem::create([
                        'order_id' => $order->id,
                        'item_type' => 'product',
                        'product_id' => $prodId,
                        'quantity' => rand(1, 3),
                        'total_price' => $subtotal,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->created_at,
                    ]);
                } else {
                    $printJob = PrintJob::create([
                        'user_id' => $user->id,
                        'file_name' => 'document_' . rand(100, 999) . '.pdf',
                        'file_path' => 'print_jobs/document_' . rand(100, 999) . '.pdf',
                        'file_size' => rand(1024, 102400),
                        'pages' => rand(1, 50),
                        'paper_size' => 'A4',
                        'color_mode' => rand(0, 1) ? 'color' : 'bw',
                        'sides' => 'double',
                        'binding' => 'none',
                        'base_price' => $subtotal,
                        'color_price' => 0,
                        'binding_price' => 0,
                        'total_price' => $subtotal,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->created_at,
                    ]);

                    OrderItem::create([
                        'order_id' => $order->id,
                        'item_type' => 'print_job',
                        'print_job_id' => $printJob->id,
                        'quantity' => 1,
                        'total_price' => $subtotal,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->created_at,
                    ]);
                }

                // Create Payment record if Paid or Refunded
                if ($pStatus === 'Paid') {
                    Payment::create([
                        'order_id' => $order->id,
                        'razorpay_payment_id' => 'pay_' . rand(100000000, 999999999),
                        'amount' => $total,
                        'paid_at' => $order->created_at,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->created_at,
                    ]);
                } elseif ($pStatus === 'Refunded') {
                    Payment::create([
                        'order_id' => $order->id,
                        'razorpay_payment_id' => 'pay_' . rand(100000000, 999999999),
                        'amount' => $total,
                        'paid_at' => $order->created_at->copy()->subMinutes(60),
                        'refund_status' => 'Refunded',
                        'created_at' => $order->created_at,
                        'updated_at' => $order->created_at,
                    ]);
                }

                $orderCount++;
            }
        }
    }
}
