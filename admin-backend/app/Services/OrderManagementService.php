<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\Notification;
use App\Events\OrderStatusUpdated;
use Illuminate\Support\Carbon;

class OrderManagementService
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get paginated and filtered orders list.
     */
    public function getFilteredOrders($search, $status, $paymentStatus, $dateRange)
    {
        $query = Order::with(['user', 'orderItems']);

        // Search by Order ID, Customer Name, or Phone Number
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('display_order_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by Order Status
        if ($status && $status !== 'all') {
            $query->where('order_status', $status);
        }

        // Filter by Payment Status
        if ($paymentStatus && $paymentStatus !== 'all') {
            $query->where('payment_status', $paymentStatus);
        }

        // Filter by Date Range
        if ($dateRange && $dateRange !== 'all') {
            if ($dateRange === 'today') {
                $query->whereDate('created_at', Carbon::today());
            } elseif ($dateRange === 'yesterday') {
                $query->whereDate('created_at', Carbon::yesterday());
            } elseif ($dateRange === 'this_week') {
                $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
            } elseif ($dateRange === 'this_month') {
                $query->whereMonth('created_at', Carbon::now()->month)
                      ->whereYear('created_at', Carbon::now()->year);
            } elseif (str_contains($dateRange, ' to ')) {
                $parts = explode(' to ', $dateRange);
                if (count($parts) === 2) {
                    $start = Carbon::parse(trim($parts[0]))->startOfDay();
                    $end = Carbon::parse(trim($parts[1]))->endOfDay();
                    $query->whereBetween('created_at', [$start, $end]);
                }
            } else {
                try {
                    $date = Carbon::parse($dateRange);
                    $query->whereDate('created_at', $date);
                } catch (\Exception $e) {
                    Log::error("Invalid date filter format: " . $dateRange);
                }
            }
        }

        return $query->latest()->paginate(10)->withQueryString();
    }

    /**
     * Get summary metrics for the orders page.
     */
    public function getOrderSummary()
    {
        return [
            'total' => Order::count(),
            'pending' => Order::whereIn('order_status', ['placed', 'processing', 'Placed', 'Processing'])->count(),
            'delivered' => Order::whereIn('order_status', ['delivered', 'Delivered'])->count(),
            'cancelled' => Order::whereIn('order_status', ['cancelled', 'Cancelled'])->count()
        ];
    }

    /**
     * Get complete details for a single order, eager loading all relevant relationships.
     */
    public function getOrderDetails($id)
    {
        return Order::with([
            'user',
            'address',
            'payment',
            'orderItems.printJob',
            'orderItems.product'
        ])
        ->where('id', $id)
        ->orWhere('display_order_id', $id)
        ->first();
    }

    /**
     * Update order status with validation and triggers.
     */
    public function updateOrderStatus($id, $newStatus)
    {
        $order = Order::find($id);
        if (!$order) {
            return false;
        }

        // Validate status transitions
        $validTransitions = [
            'Placed' => ['Processing', 'Cancelled'],
            'placed' => ['processing', 'cancelled'],
            'Processing' => ['Dispatched', 'Cancelled'],
            'processing' => ['dispatched', 'cancelled'],
            'Dispatched' => ['Delivered'],
            'dispatched' => ['delivered'],
            'Delivered' => [],
            'delivered' => [],
            'Cancelled' => [],
            'cancelled' => []
        ];

        $currentStatus = $order->order_status;
        if (isset($validTransitions[$currentStatus])) {
            $allowed = $validTransitions[$currentStatus];
            $lowerAllowed = array_map('strtolower', $allowed);
            if (!in_array(strtolower($newStatus), $lowerAllowed)) {
                Log::warning("Unauthorized order status transition from {$currentStatus} to {$newStatus} for Order #{$id}");
                return false;
            }
        }

        $order->order_status = $newStatus;
        $order->save();

        event(new OrderStatusUpdated($order));
        return true;
    }

    /**
     * Cancel the order.
     */
    public function cancelOrder($id, $reason)
    {
        $order = Order::find($id);
        if (!$order) {
            return false;
        }

        if (in_array(strtolower($order->order_status), ['delivered', 'cancelled'])) {
            return false;
        }

        // Keep casing format of status field
        $order->order_status = ctype_lower($order->order_status) ? 'cancelled' : 'Cancelled';
        $order->cancellation_reason = $reason;
        $order->save();

        event(new OrderStatusUpdated($order));
        return true;
    }

    /**
     * Mark payment as refunded.
     */
    public function markAsRefunded($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return false;
        }

        $order->payment_status = ctype_lower($order->payment_status) ? 'refunded' : 'Refunded';
        $order->save();

        if ($order->payment) {
            $order->payment->update(['refund_status' => 'refunded']);
        }

        // Send refund notification
        $this->notificationService->sendNotification(
            $order->user_id,
            'Refund Processed',
            "Refund Processed. Your refund for #{$order->display_order_id} is complete.",
            $order->id,
            'order_update'
        );

        return true;
    }

    /**
     * Send custom push notification and persist to database notifications log.
     */
    public function sendCustomNotification($orderId, $title, $message)
    {
        $order = Order::find($orderId);
        if (!$order || !$order->user_id) {
            return false;
        }

        // Send custom notification via service
        $this->notificationService->sendNotification(
            $order->user_id,
            $title,
            $message,
            $order->id,
            'system'
        );

        return true;
    }
}
