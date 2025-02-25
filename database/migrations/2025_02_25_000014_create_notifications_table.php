<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profiles')->onDelete('cascade');
            $table->text('message');
            $table->foreignId('faqs_id')->nullable()->constrained('faqs')->onDelete('cascade');
            $table->enum('type', ['order', 'payment', 'support', 'general']);
            $table->enum('status', ['unread', 'read'])->default('unread');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
