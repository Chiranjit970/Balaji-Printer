<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Address;
use App\Models\PrintJob;
use App\Models\Payment;
use App\Services\SettingsService;
use App\Http\Resources\OrderResource;
use App\Events\OrderStatusUpdated;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerOrderController extends Controller
{
    /**
     * Get user's order history.
     */
    public function index(Request $request)
    {
        $status = $request->input('statusFilter', 'all');
        $query = $request->user()->orders()->with(['orderItems.product', 'orderItems.printJob', 'address', 'payment']);

        if ($status && $status !== 'all') {
            $query->where('order_status', $status);
        }

        $orders = $query->latest()->paginate(20);

        return response()->json([
            'orders' => OrderResource::collection($orders->items()),
            'total' => $orders->total(),
            'hasMore' => $orders->hasMorePages()
        ]);
    }

    /**
     * Get single order details.
     */
    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with(['orderItems.product', 'orderItems.printJob', 'address', 'payment'])
            ->where('id', $id)
            ->orWhere('display_order_id', $id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.'
            ], 404);
        }

        return new OrderResource($order);
    }

    /**
     * Create a pending order from selected cart items.
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.cartItemId' => 'required|exists:cart_items,id',
            'deliveryAddressId' => 'required|exists:addresses,id',
            'paymentMethod' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $cartItemIds = collect($request->items)->pluck('cartItemId')->toArray();

        // 1. Fetch address
        $address = Address::find($request->deliveryAddressId);
        if ($address->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Invalid delivery address.'], 403);
        }

        // Run entire checkout in a database transaction
        try {
            $checkoutData = DB::transaction(function () use ($user, $cartItemIds, $request) {
                // 2. Fetch selected cart items
                $cartItems = CartItem::with(['product', 'printJob'])
                    ->whereIn('id', $cartItemIds)
                    ->where('user_id', $user->id)
                    ->get();

                if ($cartItems->isEmpty()) {
                    throw new \Exception('Cart items empty or invalid.');
                }

                // 3. Compute Totals
                $printJobsTotal = 0.00;
                $productsTotal = 0.00;

                foreach ($cartItems as $item) {
                    if ($item->item_type === 'product' && $item->product) {
                        $productsTotal += (float) $item->product->price * $item->quantity;
                    } elseif ($item->item_type === 'print' && $item->printJob) {
                        $printJobsTotal += (float) $item->printJob->total_price;
                    }
                }

                $subtotal = $printJobsTotal + $productsTotal;

                // Validate minimum order amount
                $minOrderAmount = SettingsService::getFloat('minimum_order_amount');
                if ($subtotal < $minOrderAmount) {
                    throw new \Exception("Minimum order amount is ₹{$minOrderAmount}. Your subtotal is ₹{$subtotal}.");
                }

                // Check if delivery is enabled
                $isDeliveryEnabled = SettingsService::getBool('is_delivery_enabled');
                if (!$isDeliveryEnabled && $request->deliveryAddressId) {
                    // This is optional if we assume 'deliveryAddressId' means delivery requested
                    // For now, if disabled, we could force fee to 0 or throw exception
                    // Let's just set delivery fee to 0 if delivery is disabled
                }

                // Load threshold & fee settings
                $freeThreshold = SettingsService::getFloat('free_delivery_threshold');
                $deliveryFee = SettingsService::getFloat('delivery_fee');
                
                // If delivery is disabled globally, we might charge 0. 
                // But normally the app should block it. Assuming fee logic applies if address provided.
                $feeApplied = ($subtotal >= $freeThreshold || !$isDeliveryEnabled) ? 0.00 : $deliveryFee;

                $total = $subtotal + $feeApplied;

                // 4. Generate unique keys
                $displayOrderId = 'BP' . mt_rand(10000000, 99999999);
                $rzpOrderId = 'rzp_order_' . Str::random(12);

                // 5. Create Order
                $order = Order::create([
                    'display_order_id' => $displayOrderId,
                    'user_id' => $user->id,
                    'address_id' => $request->deliveryAddressId,
                    'order_status' => 'placed',
                    'payment_status' => 'pending',
                    'subtotal' => $subtotal,
                    'print_jobs_total' => $printJobsTotal,
                    'products_total' => $productsTotal,
                    'delivery_charges' => $feeApplied,
                    'tax' => 0.00,
                    'total_amount' => $total,
                    'payment_method' => $request->paymentMethod,
                    'razorpay_order_id' => $rzpOrderId,
                    'estimated_delivery' => now()->addDays(2),
                ]);

                // 6. Create Order Items and detach PrintJobs from cart
                foreach ($cartItems as $item) {
                    $itemPrice = $item->item_type === 'product'
                        ? (float) $item->product->price * $item->quantity
                        : (float) $item->printJob->total_price;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'item_type' => $item->item_type,
                        'product_id' => $item->product_id,
                        'print_job_id' => $item->print_job_id,
                        'quantity' => $item->quantity,
                        'total_price' => $itemPrice,
                    ]);

                    // Remove item from cart
                    $item->delete();
                }

                return [
                    'order' => $order,
                    'rzpOrderId' => $rzpOrderId,
                    'amount' => $total
                ];
            });

            return response()->json([
                'success' => true,
                'order' => new OrderResource($checkoutData['order']),
                'razorpayOrderId' => $checkoutData['rzpOrderId'],
                'amount' => $checkoutData['amount'],
                'message' => 'Checkout generated successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Checkout failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm signature/payment callback.
     */
    public function confirmPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'orderId' => 'required',
            'razorpayPaymentId' => 'required|string',
            'razorpaySignature' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Missing razorpay transaction parameters.'
            ], 422);
        }

        $order = Order::where('id', $request->orderId)
            ->orWhere('display_order_id', $request->orderId)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.'
            ], 404);
        }

        // Run payment capture inside transaction
        try {
            DB::transaction(function () use ($order, $request) {
                // 1. Update order payment status
                $order->update([
                    'payment_status' => 'paid',
                    'razorpay_payment_id' => $request->razorpayPaymentId
                ]);

                // 2. Create Payment log record
                Payment::create([
                    'order_id' => $order->id,
                    'razorpay_payment_id' => $request->razorpayPaymentId,
                    'razorpay_signature' => $request->razorpaySignature,
                    'gateway' => 'razorpay',
                    'amount' => $order->total_amount,
                    'paid_at' => now(),
                    'refund_status' => 'none',
                ]);
            });

            // 3. Dispatch order status update event (Fires notification logs listener)
            event(new OrderStatusUpdated($order));

            return response()->json([
                'success' => true,
                'order' => new OrderResource($order),
                'message' => 'Payment confirmed successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment confirmation failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
