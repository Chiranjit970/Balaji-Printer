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
        // 1. Update categories table to include is_active
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('color');
            }
        });

        // 2. Update products table to include missing fields
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }
            if (!Schema::hasColumn('products', 'sku')) {
                $table->string('sku')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('products', 'stock_quantity')) {
                $table->integer('stock_quantity')->default(0)->after('in_stock');
            }
            if (!Schema::hasColumn('products', 'low_stock_threshold')) {
                $table->integer('low_stock_threshold')->default(5)->after('stock_quantity');
            }
            if (!Schema::hasColumn('products', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('low_stock_threshold');
            }
            if (!Schema::hasColumn('products', 'is_new_arrival')) {
                $table->boolean('is_new_arrival')->default(false)->after('is_featured');
            }
            if (!Schema::hasColumn('products', 'is_recommended')) {
                $table->boolean('is_recommended')->default(false)->after('is_best_seller');
            }
            if (!Schema::hasColumn('products', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('tags');
            }
            if (!Schema::hasColumn('products', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }
        });

        // 3. Create product_images table
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->string('image_path');
            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        // 4. Data Migration: Populate slugs and product_images table from existing JSON images
        $products = DB::table('products')->get();
        foreach ($products as $product) {
            // Slug generation
            $slug = Str::slug($product->name);
            $slugCount = DB::table('products')->where('slug', $slug)->count();
            if ($slugCount > 0) {
                $slug = $slug . '-' . $product->id;
            }

            DB::table('products')->where('id', $product->id)->update([
                'slug' => $slug,
                'is_active' => true,
            ]);

            // Migrate images
            if (!empty($product->images)) {
                $images = json_decode($product->images, true);
                if (is_array($images)) {
                    foreach ($images as $index => $imageUrl) {
                        DB::table('product_images')->insert([
                            'product_id' => $product->id,
                            'image_path' => $imageUrl,
                            'is_primary' => $index === 0,
                            'sort_order' => $index,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }

        // 5. Ensure slugs are set to unique and non-nullable
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
            $table->unique('slug');
            $table->unique('sku');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropUnique(['sku']);
        });

        Schema::dropIfExists('product_images');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'sku',
                'stock_quantity',
                'low_stock_threshold',
                'is_active',
                'is_new_arrival',
                'is_recommended',
                'meta_title',
                'meta_description'
            ]);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};
