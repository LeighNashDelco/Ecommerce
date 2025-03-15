<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddArchivedToNotificationsTable extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('notifications', 'archived')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->boolean('archived')->default(0)->after('status');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('notifications', 'archived')) {
            Schema::table('notifications', function (Blueprint $table) {
                $table->dropColumn('archived');
            });
        }
    }
}