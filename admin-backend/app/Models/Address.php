<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
      protected $table = 'addresses';

      protected $fillable = [
          'user_id',
          'label',
          'recipient_name',
          'phone',
          'line1',
          'line2',
          'landmark',
          'city',
          'state',
          'pincode',
          'is_default',
      ];

      protected $casts = [
          'is_default' => 'boolean',
      ];

      /**
       * Get the user that owns the address.
       */
      public function user()
      {
          return $this->belongsTo(User::class);
      }

      /**
       * Get the orders associated with this address.
       */
      public function orders()
      {
          return $this->hasMany(Order::class);
      }
}
