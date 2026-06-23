<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrintJob extends Model
{
      protected $table = 'print_jobs';

      protected $fillable = [
          'user_id',
          'file_name',
          'file_path',
          'file_size',
          'pages',
          'paper_size',
          'color_mode',
          'sides',
          'binding',
          'base_price',
          'color_price',
          'binding_price',
          'total_price',
      ];

      protected $casts = [
          'file_size' => 'integer',
          'pages' => 'integer',
          'base_price' => 'float',
          'color_price' => 'float',
          'binding_price' => 'float',
          'total_price' => 'float',
      ];

      /**
       * Get the user who owns this print job.
       */
      public function user()
      {
          return $this->belongsTo(User::class);
      }

      /**
       * Get the associated order item.
       */
      public function orderItem()
      {
          return $this->hasOne(OrderItem::class, 'print_job_id');
      }

      /**
       * Get the cart items referencing this print job.
       */
      public function cartItems()
      {
          return $this->hasMany(CartItem::class);
      }
}
