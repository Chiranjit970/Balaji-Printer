<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up()
    {
        // 1. Add fields to categories table
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }
            if (!Schema::hasColumn('categories', 'description')) {
                $table->text('description')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('categories', 'display_order')) {
                $table->integer('display_order')->default(0)->after('description');
            }
            if (!Schema::hasColumn('categories', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('display_order');
            }
        });

        // 2. Data Migration: Populate slugs for existing categories
        $categories = DB::table('categories')->get();
        foreach ($categories as $cat) {
            $baseSlug = Str::slug($cat->name);
            $slug = $baseSlug;
            $counter = 1;

            while (DB::table('categories')->where('slug', $slug)->where('id', '!=', $cat->id)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            DB::table('categories')->where('id', $cat->id)->update([
                'slug' => $slug
            ]);
        }

        // 3. Make slug unique and non-nullable
        Schema::table('categories', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
            $table->unique('slug');
        });
    }

    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn(['slug', 'description', 'display_order', 'is_featured']);
        });
    }
};
