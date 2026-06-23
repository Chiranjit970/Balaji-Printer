<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update settings table
        Schema::table('settings', function (Blueprint $table) {
            if (!Schema::hasColumn('settings', 'group')) {
                $table->string('group')->nullable()->after('type');
            }
            if (!Schema::hasColumn('settings', 'label')) {
                $table->string('label')->nullable()->after('group');
            }
        });

        // 2. Create settings_audit_log table
        Schema::create('settings_audit_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->string('key');
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->timestamp('changed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings_audit_log');

        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['group', 'label']);
        });
    }
};
