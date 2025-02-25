<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->unsignedBigInteger('profile_id')->nullable();
            $table->unsignedBigInteger('brand_id');
            $table->unsignedBigInteger('category_id');
            $table->string('product_name');
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(0);
            $table->text('description')->nullable();
            $table->string('product_img')->nullable();
            $table->timestamps();

            // Foreign Key Constraints
            $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
