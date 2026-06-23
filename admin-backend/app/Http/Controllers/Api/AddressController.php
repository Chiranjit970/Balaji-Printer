<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;
use App\Http\Resources\AddressResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    /**
     * Display a listing of user's addresses.
     */
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->latest()->get();
        return AddressResource::collection($addresses);
    }

    /**
     * Store a newly created address in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'line1' => 'required|string|max:255',
            'line2' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:100',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'label' => 'nullable|string|max:50',
            'isDefault' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $isFirst = $user->addresses()->count() === 0;
        $makeDefault = $isFirst || $request->input('isDefault', false);

        $address = DB::transaction(function () use ($user, $request, $makeDefault) {
            if ($makeDefault) {
                $user->addresses()->update(['is_default' => false]);
            }

            return $user->addresses()->create([
                'label' => $request->input('label', 'Home'),
                'recipient_name' => $request->name,
                'phone' => $request->phone,
                'line1' => $request->line1,
                'line2' => $request->line2,
                'landmark' => $request->landmark,
                'city' => $request->city,
                'state' => $request->state,
                'pincode' => $request->pincode,
                'is_default' => $makeDefault,
            ]);
        });

        return response()->json([
            'success' => true,
            'address' => new AddressResource($address),
            'message' => 'Address created successfully.'
        ]);
    }

    /**
     * Update the specified address.
     */
    public function update(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'line1' => 'required|string|max:255',
            'line2' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:100',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'label' => 'nullable|string|max:50',
            'isDefault' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $makeDefault = $request->input('isDefault', $address->is_default);

        $address = DB::transaction(function () use ($address, $request, $makeDefault) {
            if ($makeDefault && !$address->is_default) {
                $address->user->addresses()->update(['is_default' => false]);
            }

            $address->update([
                'label' => $request->input('label', $address->label),
                'recipient_name' => $request->name,
                'phone' => $request->phone,
                'line1' => $request->line1,
                'line2' => $request->line2,
                'landmark' => $request->landmark,
                'city' => $request->city,
                'state' => $request->state,
                'pincode' => $request->pincode,
                'is_default' => $makeDefault,
            ]);

            return $address;
        });

        return response()->json([
            'success' => true,
            'address' => new AddressResource($address),
            'message' => 'Address updated successfully.'
        ]);
    }

    /**
     * Delete the specified address.
     */
    public function destroy(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found.'
            ], 404);
        }

        DB::transaction(function () use ($address) {
            $wasDefault = $address->is_default;
            $user = $address->user;

            $address->delete();

            // Re-assign default if deleted
            if ($wasDefault) {
                $next = $user->addresses()->first();
                if ($next) {
                    $next->update(['is_default' => true]);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully.'
        ]);
    }

    /**
     * Mark address as default.
     */
    public function setDefault(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found.'
            ], 404);
        }

        DB::transaction(function () use ($address) {
            $address->user->addresses()->update(['is_default' => false]);
            $address->update(['is_default' => true]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Address set as default.'
        ]);
    }
}
