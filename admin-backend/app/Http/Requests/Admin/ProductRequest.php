<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Get current product ID for unique-except-self rules
        $productId = $this->route('product')?->id;

        return [
            'name'                => 'required|string|max:255',
            'description'         => 'required|string',
            'price'               => 'required|numeric|min:0.01',
            'original_price'      => 'nullable|numeric|min:0',
            'category_id'         => 'required|string|exists:categories,id',
            'stock_status'        => 'required|in:in_stock,out_of_stock,pre_order',
            'stock_quantity'      => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'sku'                 => "nullable|string|max:100|unique:products,sku,{$productId},id",
            'is_featured'         => 'nullable|boolean',
            'is_best_seller'      => 'nullable|boolean',
            'is_new_arrival'      => 'nullable|boolean',
            'is_recommended'      => 'nullable|boolean',
            'tags'                => 'nullable|array',
            'tags.*'              => 'string|max:50',
            'meta_title'          => 'nullable|string|max:255',
            'meta_description'    => 'nullable|string|max:500',
            'images'              => 'nullable|array|max:5',
            'images.*'            => 'image|mimes:jpg,jpeg,png|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'Product name is required.',
            'description.required'  => 'Description is required.',
            'price.required'        => 'Price is required.',
            'price.min'             => 'Price must be greater than zero.',
            'category_id.required'  => 'Please select a category.',
            'category_id.exists'    => 'Selected category does not exist.',
            'stock_status.required' => 'Please select a stock status.',
            'stock_status.in'       => 'Invalid stock status selected.',
            'sku.unique'            => 'This SKU is already in use.',
            'images.*.max'          => 'Each image must be under 2MB.',
            'images.*.mimes'        => 'Only JPG and PNG images are allowed.',
        ];
    }

    /**
     * Normalize checkbox booleans before validation.
     * HTML forms send "on" or nothing — convert to true/false.
     */
    protected function prepareForValidation(): void
    {
        $booleanFields = [
            'is_featured', 'is_best_seller',
            'is_new_arrival', 'is_recommended'
        ];

        foreach ($booleanFields as $field) {
            $this->merge([
                $field => $this->has($field) ? true : false,
            ]);
        }

        // Normalize empty original_price
        if ($this->original_price === '' || $this->original_price === '0.00') {
            $this->merge(['original_price' => null]);
        }
    }
}
