<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'per_page']);
        $users = $this->userService->getFilteredUsers($filters);
        $summary = $this->userService->getSummary();

        return view('admin.users.index', compact('users', 'summary', 'filters'));
    }

    /**
     * Display a specific user's details.
     */
    public function show(User $user)
    {
        $user->load('addresses');
        $orders = $user->orders()->latest('created_at')->paginate(5);

        return view('admin.users.show', compact('user', 'orders'));
    }

    /**
     * Update user details (name and email only).
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ]);

        $this->userService->updateUser($user, $data);

        return back()->with('success', "User profile updated.");
    }

    /**
     * Toggle the block status of the user.
     */
    public function toggleBlock(User $user)
    {
        $isBlocked = $this->userService->toggleBlock($user);

        $message = $isBlocked 
            ? "User {$user->name} has been blocked successfully." 
            : "User {$user->name} has been unblocked.";

        return back()->with($isBlocked ? 'warning' : 'success', $message);
    }

    /**
     * Send a custom push notification to the user.
     */
    public function sendNotification(Request $request, User $user)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        $this->userService->sendCustomNotification($user, $data);

        return back()->with('success', "Notification sent to {$user->name}.");
    }
}
