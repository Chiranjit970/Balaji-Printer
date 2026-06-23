<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => (string) $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'body' => $this->message,
            'read' => $this->read_at !== null,
            'timestamp' => $this->created_at?->toIso8601String(),
            'orderId' => $this->order_id ? (string) $this->order_id : null,
        ];
    }
}
