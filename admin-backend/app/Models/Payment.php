<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
      protected $table = 'payments';

      protected $fillable = [
          'order_id',
          'razorpay_payment_id',
          'razorpay_signature',
          'gateway',
          'amount',
          'paid_at',
          'refund_status',
      ];

      protected $casts = [
          'amount' => 'float',
          'paid_at' => 'datetime',
      ];

      /**
       * Get the order associated with this payment.
       */
      public function order()
      {
          return $this->belongsTo(Order::class);
      }
}
