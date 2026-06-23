<?php

namespace App\Listeners;

use App\Events\OrderStatusUpdated;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderStatusNotification implements ShouldQueue
{
    protected $notificationService;

    /**
     * Create the event listener.
     */
    public function __construct(\App\Services\NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\OrderStatusUpdated  $event
     * @return void
     */
    public function handle(OrderStatusUpdated $event)
    {
        $order = $event->order;
        $status = $order->order_status;
        $userId = $order->user_id;

        // Casing compatibility mapping (handles both lowercase and uppercase statuses)
        $normalizedStatus = strtolower($status);

        $messages = [
            'placed'     => "Order Received! Your order #{$order->display_order_id} has been placed.",
            'processing' => "Order Processing. Your order #{$order->display_order_id} is being prepared.",
            'dispatched' => "Order Dispatched! Your order #{$order->display_order_id} is on its way.",
            'delivered'  => "Order Delivered! Your order #{$order->display_order_id} has been delivered.",
            'cancelled'  => "Order Cancelled. Your order #{$order->display_order_id} has been cancelled."
        ];

        if (isset($messages[$normalizedStatus])) {
            $message = $messages[$normalizedStatus];
            
            // Delegate notification persistence and dispatch to the service
            $this->notificationService->sendNotification(
                $userId,
                'Order Status Updated',
                $message,
                $order->id,
                'order_update'
            );
        }
    }
}

