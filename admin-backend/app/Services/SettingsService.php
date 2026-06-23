<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\SettingsAuditLog;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SettingsService
{
    protected const CACHE_KEY = 'app_settings';
    protected const CACHE_TTL = 600; // 10 minutes in seconds

    /**
     * Get all cached settings.
     *
     * @return array
     */
    public static function all(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Setting::all()->keyBy('key')->map(function ($setting) {
                return [
                    'value' => $setting->value, // getValueAttribute handles casting automatically
                    'raw_value' => $setting->getRawOriginal('value'),
                    'type' => $setting->type,
                    'group' => $setting->group,
                    'label' => $setting->label,
                    'description' => $setting->description
                ];
            })->toArray();
        });
    }

    /**
     * Get a setting value by key.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get(string $key, $default = null)
    {
        $settings = self::all();

        if (array_key_exists($key, $settings)) {
            return $settings[$key]['value'];
        }

        return $default;
    }

    /**
     * Determine if a setting exists.
     *
     * @param string $key
     * @return bool
     */
    public static function has(string $key): bool
    {
        $settings = self::all();
        return array_key_exists($key, $settings);
    }

    /**
     * Save/update a group of settings.
     *
     * @param array $updates Key-value pairs
     * @param int $adminId The admin changing the settings
     * @return void
     * @throws \Exception
     */
    public static function updateSettings(array $updates, int $adminId): void
    {
        DB::transaction(function () use ($updates, $adminId) {
            $now = Carbon::now();

            foreach ($updates as $key => $value) {
                // Find existing setting
                $setting = Setting::where('key', $key)->first();
                if (!$setting) {
                    continue; // Skip keys that are not registered settings
                }

                // Check if value changed
                $oldRawValue = $setting->getRawOriginal('value');
                $newRawValue = (string) $value;

                if ($oldRawValue !== $newRawValue) {
                    // Update setting
                    $setting->update([
                        'value' => $newRawValue
                    ]);

                    // Write audit log
                    SettingsAuditLog::create([
                        'admin_id' => $adminId,
                        'key' => $key,
                        'old_value' => $oldRawValue,
                        'new_value' => $newRawValue,
                        'changed_at' => $now,
                    ]);
                }
            }
        });

        // Invalidate cache
        Cache::forget(self::CACHE_KEY);
    }
}
