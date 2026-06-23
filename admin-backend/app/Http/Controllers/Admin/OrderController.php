<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Services\OrderManagementService;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderManagementService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display a listing of orders (Page 3.1).
     */
    public function index(Request $request)
    {
        // Mock query logic since DB isn't connected here
        $orders = $this->orderService->getFilteredOrders(
            $request->input('search'),
            $request->input('status'),
            $request->input('payment_status'),
            $request->input('date')
        );

        $summary = $this->orderService->getOrderSummary();

        return view('admin.orders.index', compact('orders', 'summary'));
    }

    /**
     * Display the specified order details (Page 3.2).
     */
    public function show($id)
    {
        $order = $this->orderService->getOrderDetails($id);
        
        if (!$order) {
            return redirect()->route('admin.orders.index')->with('error', 'Order not found.');
        }

        return view('admin.orders.show', compact('order'));
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Placed,Processing,Dispatched,Delivered,Cancelled'
        ]);

        $success = $this->orderService->updateOrderStatus($id, $request->status);

        if ($success) {
            $order = \App\Models\Order::find($id);
            $displayId = $order ? $order->display_order_id : $id;
            return back()->with('success', "Order {$displayId} status updated to {$request->status}.");
        }

        return back()->with('error', 'Failed to update order status or invalid transition.');
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, $id)
    {
        $success = $this->orderService->cancelOrder($id, $request->input('reason', 'Cancelled by Admin'));

        if ($success) {
            $order = \App\Models\Order::find($id);
            $displayId = $order ? $order->display_order_id : $id;
            return back()->with('success', "Order {$displayId} has been cancelled.");
        }

        return back()->with('error', 'Order cannot be cancelled at this stage.');
    }

    /**
     * Mark an order as refunded.
     */
    public function refund(Request $request, $id)
    {
        $success = $this->orderService->markAsRefunded($id);

        if ($success) {
            $order = \App\Models\Order::find($id);
            $displayId = $order ? $order->display_order_id : $id;
            return back()->with('success', "Payment for Order {$displayId} marked as refunded.");
        }

        return back()->with('error', 'Failed to process refund.');
    }

    /**
     * Send a custom push notification to the customer.
     */
    public function notify(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'message' => 'required|string|max:500'
        ]);

        $success = $this->orderService->sendCustomNotification($id, $request->title, $request->message);

        if ($success) {
            return back()->with('success', "Notification sent successfully to customer.");
        }

        return back()->with('error', 'Failed to send notification.');
    }
}
