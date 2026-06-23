<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Get current category ID (slug or primary key ID) for unique exception
        $categoryId = $this->route('category')?->id;

        return [
            'name'          => "required|string|max:100|unique:categories,name,{$categoryId},id",
            'description'   => 'nullable|string|max:500',
            'display_order' => 'nullable|integer|min:0',
            'is_active'     => 'nullable|boolean',
            'is_featured'   => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required.',
            'name.unique'   => 'This category name is already in use.',
            'name.max'      => 'Category name cannot exceed 100 characters.',
            'display_order.integer' => 'Display order must be an integer.',
            'display_order.min' => 'Display order cannot be negative.',
        ];
    }

    /**
     * Normalize checkbox and switch values before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active'   => $this->has('is_active') ? true : false,
            'is_featured' => $this->has('is_featured') ? true : false,
        ]);
    }
}
