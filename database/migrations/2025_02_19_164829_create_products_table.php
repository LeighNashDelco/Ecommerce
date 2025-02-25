<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->foreignId('profile_id')->constrained('profiles')->onDelete('cascade'); // Correct FK
            $table->string('product_name');
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(0); // Added quantity column
            $table->text('description')->nullable();
            $table->string('product_img')->nullable(); // Column for image path
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
