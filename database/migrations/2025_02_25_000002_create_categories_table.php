<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // Auto-increments as UNSIGNED BIGINT (20)
            $table->string('category_name');
            $table->timestamps();
        }); // ✅ Properly closed Schema::create
    }

    public function down()
    {
        Schema::dropIfExists('categories'); // ✅ Dropping the correct table
    }
};
