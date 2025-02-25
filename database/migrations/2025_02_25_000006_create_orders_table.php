<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profiles')->onDelete('cascade'); // Customer
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Product
            $table->dateTime('order_date')->default(now()); // Order Date
            $table->integer('quantity')->default(1); // Quantity
            $table->decimal('total_amount', 10, 2); // Amount
            $table->foreignId('status_id')->constrained('statuses')->onDelete('cascade');
            $table->dateTime('estimated_delivery_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
