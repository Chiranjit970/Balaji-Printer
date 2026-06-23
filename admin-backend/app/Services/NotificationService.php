<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\UserDeviceToken;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send order update or custom notification to user, saving it to database and simulating FCM dispatch.
     */
    public function sendNotification($userId, $title, $body, $orderId = null, $type = 'order_update')
    {
        // 1. Save notification to database (using table schema: user_id, type, title, message, order_id)
        $notification = Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $body,
            'order_id' => $orderId,
        ]);

        // 2. Fetch user's registered device tokens for FCM push alerts
        $tokens = UserDeviceToken::where('user_id', $userId)->pluck('token')->toArray();

        // 3. FCM Firebase Admin SDK mock / simulation point
        if (!empty($tokens)) {
            Log::info("FCM push dispatched to User $userId via Firebase Admin SDK for tokens: " . implode(', ', $tokens) . " | Title: '$title' | Body: '$body'");
        } else {
            Log::info("No FCM tokens found for User $userId. Notification logged to database only.");
        }

        return $notification;
    }
}
