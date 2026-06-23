<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        // 1. Format order items
        $formattedItems = [];
        foreach ($this->orderItems as $item) {
            $row = [
                'cartItemId' => (string) $item->id,
                'type' => $item->item_type,
                'quantity' => (int) $item->quantity,
                'price' => (float) $item->total_price,
            ];

            if ($item->item_type === 'product') {
                $row['productId'] = (string) $item->product_id;
                $row['name'] = $item->product ? $item->product->name : 'Deleted Product';
                $row['image'] = $item->product && $item->product->images ? $item->product->images[0] : null;
            } else { // print
                $printJob = $item->printJob;
                $row['fileName'] = $printJob ? $printJob->file_name : 'Deleted Document';
                $row['pageCount'] = $printJob ? (int) $printJob->pages : 0;
                $row['copies'] = $printJob ? (int) $printJob->copies : 1;
                $row['options'] = [
                    'color' => $printJob ? $printJob->color_mode : 'Black & White',
                    'paperSize' => $printJob ? $printJob->paper_size : 'A4',
                    'sides' => $printJob ? $printJob->sides : 'Single Side',
                    'binding' => $printJob ? $printJob->binding : 'No Binding',
                ];
            }
            $formattedItems[] = $row;
        }

        // 2. Generate timeline based on status and timestamps
        $timelineSteps = [
            ['status' => 'placed', 'label' => 'Order Placed'],
            ['status' => 'processing', 'label' => 'Processing'],
            ['status' => 'dispatched', 'label' => 'Dispatched'],
            ['status' => 'delivered', 'label' => 'Delivered'],
        ];

        $currentStatus = strtolower($this->order_status);
        $isCancelled = $currentStatus === 'cancelled';
        
        // Find step index of current status
        $currentStepIndex = -1;
        foreach ($timelineSteps as $index => $step) {
            if ($step['status'] === $currentStatus) {
                $currentStepIndex = $index;
                break;
            }
        }

        $timeline = [];
        foreach ($timelineSteps as $index => $step) {
            $isBefore = $index <= $currentStepIndex && !$isCancelled;
            $isCurrent = $step['status'] === $currentStatus && !$isCancelled;
            
            // Reconstruct timestamps dynamically
            $timestamp = null;
            if ($isBefore || $isCurrent) {
                if ($step['status'] === 'placed') {
                    $timestamp = $this->created_at?->toIso8601String();
                } else {
                    $timestamp = $this->updated_at?->toIso8601String();
                }
            }

            $timeline[] = [
                'status' => $step['status'],
                'label' => $step['label'],
                'timestamp' => $timestamp,
                'isCompleted' => $isBefore && $step['status'] !== $currentStatus,
                'isCurrent' => $isCurrent,
            ];
        }

        // If cancelled, inject cancelled step at the end of timeline
        if ($isCancelled) {
            $timeline[] = [
                'status' => 'cancelled',
                'label' => 'Order Cancelled',
                'timestamp' => $this->updated_at?->toIso8601String(),
                'isCompleted' => true,
                'isCurrent' => true,
            ];
        }

        return [
            'id' => (string) $this->id,
            'displayOrderId' => $this->display_order_id,
            'status' => $this->order_status,
            'paymentStatus' => $this->payment_status,
            'paymentMethod' => $this->payment_method,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
            'estimatedDelivery' => $this->estimated_delivery?->toIso8601String(),
            'cancellationReason' => $this->cancellation_reason,
            'pricing' => [
                'subtotal' => (float) $this->subtotal,
                'printJobsTotal' => (float) $this->print_jobs_total,
                'productsTotal' => (float) $this->products_total,
                'deliveryFee' => (float) $this->delivery_charges,
                'tax' => (float) $this->tax,
                'total' => (float) $this->total_amount,
                'currency' => 'INR',
            ],
            'items' => $formattedItems,
            'deliveryAddress' => $this->address ? new AddressResource($this->address) : null,
            'timeline' => $timeline,
        ];
    }
}
