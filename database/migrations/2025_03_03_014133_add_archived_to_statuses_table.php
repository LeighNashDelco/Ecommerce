<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('statuses', function (Blueprint $table) {
            if (!Schema::hasColumn('statuses', 'archived')) {
                $table->boolean('archived')->default(false)->after('status_name');
            }
        });
    }

    public function down()
    {
        Schema::table('statuses', function (Blueprint $table) {
            if (Schema::hasColumn('statuses', 'archived')) {
                $table->dropColumn('archived');
            }
        });
    }
};