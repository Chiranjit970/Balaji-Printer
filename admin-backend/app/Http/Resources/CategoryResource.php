<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'icon' => $this->icon,
            'color' => $this->color,
            'productCount' => (int) $this->products()->count(),
        ];
    }
}
