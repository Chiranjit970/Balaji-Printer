<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Get KPI summaries for users.
     */
    public function getSummary(): array
    {
        $startOfMonth = Carbon::now()->startOfMonth();

        return [
            'total'          => User::count(),
            'active'         => User::where('is_blocked', false)->count(),
            'blocked'        => User::where('is_blocked', true)->count(),
            'new_this_month' => User::where('created_at', '>=', $startOfMonth)->count(),
        ];
    }

    /**
     * Get filtered and paginated list of users.
     */
    public function getFilteredUsers(array $filters)
    {
        $query = User::withCount('orders')
                     ->latest('created_at');

        // Search
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            });
        }

        // Status Filter
        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('is_blocked', (bool) $filters['status']);
        }

        $perPage = in_array((int)($filters['per_page'] ?? 10), [10, 25, 50])
            ? (int) ($filters['per_page'] ?? 10)
            : 10;

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Update user profile (Only name and email are mutable).
     */
    public function updateUser(User $user, array $data): User
    {
        $user->update([
            'name'  => $data['name'],
            'email' => $data['email'] ?? null,
        ]);

        return $user->fresh();
    }

    /**
     * Toggle block/unblock status.
     */
    public function toggleBlock(User $user): bool
    {
        $newStatus = !$user->is_blocked;

        DB::transaction(function () use ($user, $newStatus) {
            $user->update(['is_blocked' => $newStatus]);

            // If user is blocked, invalidate all current sessions immediately
            if ($newStatus) {
                $user->tokens()->delete();
            }
        });

        return $newStatus;
    }

    /**
     * Send notification to a specific user.
     */
    public function sendCustomNotification(User $user, array $data)
    {
        return $this->notificationService->sendNotification(
            $user->id,
            $data['title'],
            $data['body'],
            null, // orderId (null for custom user alert)
            'custom' // notification type
        );
    }
}
