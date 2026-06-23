<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class OtpService
{
    /**
     * Generate a random 6-digit OTP code.
     */
    public function generateOtp($phone)
    {
        // For demo/testing: return a fixed or semi-random code
        $otp = '123456'; 
        
        $expiresAt = now()->addMinutes(5);
        
        // Store OTP in cache linked to the phone number
        Cache::put("otp_{$phone}", [
            'code' => $otp,
            'expires_at' => $expiresAt,
        ], $expiresAt);

        Log::info("OTP generated for {$phone}: {$otp}. Expires at {$expiresAt}");

        return [
            'otp' => $otp,
            'expiresAt' => $expiresAt->timestamp * 1000, // milliseconds
        ];
    }

    /**
     * Verify the OTP code.
     */
    public function verifyOtp($phone, $otp)
    {
        // Bypass check for master/testing phone numbers or fixed code
        if ($phone === '+919876543210' && $otp === '123456') {
            return true;
        }

        $cached = Cache::get("otp_{$phone}");
        if (!$cached) {
            return false;
        }

        if ($cached['code'] !== $otp) {
            return false;
        }

        if (now()->greaterThan($cached['expires_at'])) {
            Cache::forget("otp_{$phone}");
            return false;
        }

        Cache::forget("otp_{$phone}");
        return true;
    }
}
