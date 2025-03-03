<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->unsignedBigInteger('faq_category_id');
            $table->boolean('archived')->default(false);
            $table->timestamps();

            $table->foreign('faq_category_id')->references('id')->on('faq_categories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('faqs');
    }
};