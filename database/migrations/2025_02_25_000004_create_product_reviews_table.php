<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('profile_id');
            $table->integer('rating');
            $table->text('comment');
            $table->boolean('archived')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_reviews');
    }
};
