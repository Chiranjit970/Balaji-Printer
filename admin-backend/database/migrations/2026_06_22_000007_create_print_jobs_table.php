<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('print_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->bigInteger('file_size');
            $table->integer('pages');
            $table->string('paper_size');
            $table->string('color_mode');
            $table->string('sides');
            $table->string('binding');
            $table->decimal('base_price', 10, 2)->default(0.00);
            $table->decimal('color_price', 10, 2)->default(0.00);
            $table->decimal('binding_price', 10, 2)->default(0.00);
            $table->decimal('total_price', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('print_jobs');
    }
};
