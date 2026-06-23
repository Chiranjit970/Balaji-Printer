<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray($request)
    {
        $data = [
            'cartItemId' => (string) $this->id,
            'type' => $this->item_type,
            'addedAt' => $this->created_at?->toIso8601String(),
        ];

        if ($this->item_type === 'product') {
            $data['productId'] = (string) $this->product_id;
            $data['name'] = $this->product ? $this->product->name : '';
            $data['price'] = $this->product ? (float) $this->product->price : 0.00;
            $data['quantity'] = (int) $this->quantity;
            $data['image'] = $this->product && $this->product->images ? $this->product->images[0] : null;
        } else { // print
            $printJob = $this->printJob;
            $data['fileName'] = $printJob ? $printJob->file_name : '';
            $data['pageCount'] = $printJob ? (int) $printJob->pages : 0;
            $data['copies'] = $printJob ? (int) $printJob->copies : 1;
            $data['price'] = $printJob ? (float) $printJob->total_price : 0.00;
            $data['options'] = [
                'color' => $printJob ? $printJob->color_mode : 'Black & White',
                'paperSize' => $printJob ? $printJob->paper_size : 'A4',
                'sides' => $printJob ? $printJob->sides : 'Single Side',
                'binding' => $printJob ? $printJob->binding : 'No Binding',
            ];
        }

        return $data;
    }
}
