<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('razorpay_payment_id');
            $table->string('razorpay_signature')->nullable();
            $table->string('gateway')->default('razorpay');
            $table->decimal('amount', 10, 2);
            $table->timestamp('paid_at');
            $table->string('refund_status')->default('none');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};
