<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CustomerOrderController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Routes (No Auth)
Route::post('/auth/request-otp', [UserAuthController::class, 'requestOtp']);
Route::post('/auth/verify-otp', [UserAuthController::class, 'verifyOtp']);

Route::get('/categories', [StoreController::class, 'getCategories']);
Route::get('/products', [StoreController::class, 'getProducts']);
Route::get('/products/{id}', [StoreController::class, 'getProduct']);
Route::get('/products/{id}/related', [StoreController::class, 'getRelatedProducts']);
Route::get('/banners', [StoreController::class, 'getBanners']);
Route::get('/settings/public', [StoreController::class, 'getSettings']);

// Protected Routes (Requires Sanctum Token)
Route::middleware(['auth:sanctum', 'check.blocked'])->group(function () {
    // Auth Profile
    Route::get('/auth/me', [UserAuthController::class, 'me']);

    // Address Management
    Route::prefix('addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::put('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
        Route::post('/{id}/set-default', [AddressController::class, 'setDefault']);
    });

    // Cart Management
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
        Route::post('/clear', [CartController::class, 'clear']);
    });

    // Print Calculation
    Route::post('/print/calculate-price', [CartController::class, 'calculatePrice']);

    // Checkout & Orders
    Route::prefix('orders')->group(function () {
        Route::post('/checkout', [CustomerOrderController::class, 'checkout']);
        Route::get('/', [CustomerOrderController::class, 'index']);
        Route::get('/{id}', [CustomerOrderController::class, 'show']);
    });

    // Payments Confirmations
    Route::post('/payments/confirm', [CustomerOrderController::class, 'confirmPayment']);

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllRead']);
    });

    // Device token mapping
    Route::post('/device-tokens', [NotificationController::class, 'updateDeviceToken']);
});
