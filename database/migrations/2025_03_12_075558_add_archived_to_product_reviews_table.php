<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddArchivedToProductReviewsTable extends Migration
{
    public function up()
    {
        Schema::table('product_reviews', function (Blueprint $table) {
            $table->boolean('archived')->default(false)->after('comment');
        });
    }

    public function down()
    {
        Schema::table('product_reviews', function (Blueprint $table) {
            $table->dropColumn('archived');
        });
    }
}