<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    public function index(Request $request): View
    {
        $filters = $request->only('search');
        $users   = $this->userService->getPaginatedUsers($filters);

        return view('admin.users.index', compact('users', 'filters'));
    }
}
