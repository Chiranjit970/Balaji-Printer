<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\OtpService;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;

class UserAuthController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Request a login OTP.
     */
    public function requestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^(\+91[\-\s]?)?[0-9]{10}$/'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid phone number format.'
            ], 422);
        }

        $phone = $request->phone;
        $otpDetails = $this->otpService->generateOtp($phone);

        return response()->json([
            'success' => true,
            'otp' => app()->environment('local') ? $otpDetails['otp'] : null, // expose only in local dev
            'expiresAt' => $otpDetails['expiresAt'],
            'message' => 'OTP sent successfully.'
        ]);
    }

    /**
     * Verify OTP and issue access token.
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'otp' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Phone and 6-digit OTP code are required.'
            ], 422);
        }

        $phone = $request->phone;
        $otp = $request->otp;

        $isValid = $this->otpService->verifyOtp($phone, $otp);

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP.'
            ], 401);
        }

        // Find or create the user
        $user = User::firstOrCreate(
            ['phone' => $phone],
            ['name' => 'Customer ' . substr($phone, -4)]
        );

        // Revoke old tokens if any
        $user->tokens()->delete();

        // Create Sanctum Token
        $token = $user->createToken('customer_app_access_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => new UserResource($user),
            'message' => 'Authenticated successfully.'
        ]);
    }

    /**
     * Retrieve authenticated user details.
     */
    public function me(Request $request)
    {
        return response()->json([
            'valid' => true,
            'user' => new UserResource($request->user())
        ]);
    }
}
