<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\PrintJob;
use App\Models\Product;
use App\Models\Setting;
use App\Services\PrintPricingService;
use App\Http\Resources\CartItemResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Get all cart items for user.
     */
    public function index(Request $request)
    {
        $items = $request->user()->cartItems()->with(['product', 'printJob'])->latest()->get();
        return CartItemResource::collection($items);
    }

    /**
     * Add an item to the cart.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:product,print',
            'productId' => 'required_if:type,product|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
            // File & options needed if type = print
            'fileName' => 'required_if:type,print|string',
            'fileSize' => 'required_if:type,print|integer',
            'pageCount' => 'required_if:type,print|integer|min:1',
            'copies' => 'required_if:type,print|integer|min:1',
            'options' => 'required_if:type,print|array',
            'options.color' => 'required_if:type,print|string',
            'options.paperSize' => 'required_if:type,print|string',
            'options.sides' => 'required_if:type,print|string',
            'options.binding' => 'required_if:type,print|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $quantity = $request->input('quantity', 1);

        $cartItem = DB::transaction(function () use ($user, $request, $quantity) {
            if ($request->type === 'product') {
                // Check if product already exists in cart
                $existing = $user->cartItems()
                    ->where('item_type', 'product')
                    ->where('product_id', $request->productId)
                    ->first();

                if ($existing) {
                    $existing->increment('quantity', $quantity);
                    return $existing;
                }

                return $user->cartItems()->create([
                    'item_type' => 'product',
                    'product_id' => $request->productId,
                    'quantity' => $quantity,
                ]);
            } else { // print
                // 1. Calculate price from settings
                $pricing = PrintPricingService::calculate(
                    $request->pageCount,
                    $request->copies,
                    $request->options ?? []
                );

                // 2. Create PrintJob record
                $printJob = PrintJob::create([
                    'user_id' => $user->id,
                    'file_name' => $request->fileName,
                    'file_path' => $request->input('filePath', 'uploads/documents/placeholder.pdf'), // default placeholder path
                    'file_size' => $request->fileSize,
                    'pages' => $request->pageCount,
                    'paper_size' => $request->options['paperSize'],
                    'color_mode' => $request->options['color'],
                    'sides' => $request->options['sides'],
                    'binding' => $request->options['binding'],
                    'base_price' => $pricing['page_price'],
                    'color_price' => $pricing['color_multiplier'] > 1 && strtolower($request->options['color'] ?? '') === 'color' ? $pricing['page_price'] : 0,
                    'binding_price' => $pricing['binding_cost'],
                    'total_price' => $pricing['total'],
                ]);

                // 3. Create CartItem record linked to the PrintJob
                return $user->cartItems()->create([
                    'item_type' => 'print',
                    'print_job_id' => $printJob->id,
                    'quantity' => 1, // print job is always single line copy wrapper
                ]);
            }
        });

        // Eager load relations for formatting
        $cartItem->load(['product', 'printJob']);

        return response()->json([
            'success' => true,
            'cartItem' => new CartItemResource($cartItem),
            'message' => 'Added to cart successfully.'
        ]);
    }

    /**
     * Update quantity for product item in cart.
     */
    public function update(Request $request, $id)
    {
        $cartItem = $request->user()->cartItems()->find($id);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Quantity must be at least 1.'
            ], 422);
        }

        if ($cartItem->item_type !== 'product') {
            return response()->json([
                'success' => false,
                'message' => 'Print job quantities are managed inside their options configuration.'
            ], 422);
        }

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'success' => true,
            'cartItem' => new CartItemResource($cartItem),
            'message' => 'Cart updated successfully.'
        ]);
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, $id)
    {
        $cartItem = $request->user()->cartItems()->find($id);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart.'
            ], 404);
        }

        DB::transaction(function () use ($cartItem) {
            // Delete referenced print job if it is a print item
            if ($cartItem->item_type === 'print' && $cartItem->print_job_id) {
                PrintJob::destroy($cartItem->print_job_id);
            }
            $cartItem->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Removed from cart successfully.'
        ]);
    }

    /**
     * Clear all items in the user's cart.
     */
    public function clear(Request $request)
    {
        $user = $request->user();
        
        DB::transaction(function () use ($user) {
            // Find all print jobs in the cart to clean up
            $printJobIds = $user->cartItems()
                ->where('item_type', 'print')
                ->whereNotNull('print_job_id')
                ->pluck('print_job_id')
                ->toArray();

            if (!empty($printJobIds)) {
                PrintJob::whereIn('id', $printJobIds)->delete();
            }

            $user->cartItems()->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully.'
        ]);
    }

    /**
     * API endpoint to calculate price preview dynamically.
     */
    public function calculatePrice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pages' => 'required|integer|min:1',
            'copies' => 'required|integer|min:1',
            'options' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $pricing = PrintPricingService::calculate(
            $request->pages,
            $request->copies,
            $request->options ?? []
        );

        return response()->json([
            'success' => true,
            'data' => $pricing
        ]);
    }
}
