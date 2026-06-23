<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\FileDownloadController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RevenueController;
use App\Http\Controllers\Admin\SettingsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Admin Portal Routes
Route::prefix('admin')->name('admin.')->group(function () {

    // Authentication Routes
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
        Route::post('login', [AuthController::class, 'login']);
    });

    // Protected Admin Routes
    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');

        // Dashboard (Module 2)
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Orders Management (Module 3)
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('index');
            Route::get('{id}', [OrderController::class, 'show'])->name('show');
            
            // Order Actions
            Route::post('{id}/status', [OrderController::class, 'updateStatus'])->name('updateStatus');
            Route::post('{id}/cancel', [OrderController::class, 'cancel'])->name('cancel');
            Route::post('{id}/refund', [OrderController::class, 'refund'])->name('refund');
            Route::post('{id}/notify', [OrderController::class, 'notify'])->name('notify');
            
            // File Downloads
            Route::get('files/{print_job_id}/download', [FileDownloadController::class, 'download'])->name('files.download');
        });

        // Products Management (Module 4)
        Route::post('/products/bulk', [ProductController::class, 'bulk'])->name('products.bulk');
        Route::resource('products', ProductController::class)->except(['show']);
        Route::patch('/products/{product}/toggle-active', [ProductController::class, 'toggleActive'])->name('products.toggleActive');
        Route::patch('/products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('products.toggleFeatured');
        
        // Product Images
        Route::post('/products/{product}/images', [ProductImageController::class, 'store'])->name('products.images.store');
        Route::delete('/products/images/{image}', [ProductImageController::class, 'destroy'])->name('products.images.destroy');
        Route::patch('/products/images/{image}/primary', [ProductImageController::class, 'setPrimary'])->name('products.images.setPrimary');

        // Category Management (Module 5)
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::patch('/categories/{category}/toggle-active', [CategoryController::class, 'toggleActive'])->name('categories.toggleActive');
        Route::patch('/categories/{category}/toggle-featured', [CategoryController::class, 'toggleFeatured'])->name('categories.toggleFeatured');

        // User Management (Module 6)
        Route::resource('users', UserController::class)->only(['index', 'show', 'update']);
        Route::post('/users/{user}/toggle-block', [UserController::class, 'toggleBlock'])->name('users.toggleBlock');
        Route::post('/users/{user}/notify', [UserController::class, 'sendNotification'])->name('users.notify');

        // Revenue & Reports (Module 7)
        Route::get('/revenue', [RevenueController::class, 'index'])->name('revenue.index');
        Route::get('/revenue/export', [RevenueController::class, 'exportCsv'])->name('revenue.export');

        // Settings & Admin Account (Module 8)
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [SettingsController::class, 'index'])->name('index');
            Route::post('/', [SettingsController::class, 'save'])->name('save');
            Route::get('/account', [SettingsController::class, 'account'])->name('account');
            Route::post('/account/profile', [SettingsController::class, 'updateProfile'])->name('account.updateProfile');
            Route::post('/account/password', [SettingsController::class, 'updatePassword'])->name('account.updatePassword');
        });
    });
});

