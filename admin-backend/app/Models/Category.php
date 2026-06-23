<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'icon',
        'color',
    ];

    /**
     * Get the products associated with this category.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
