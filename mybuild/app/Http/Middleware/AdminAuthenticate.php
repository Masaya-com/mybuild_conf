<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate;

class AdminAuthenticate extends Authenticate
{
    protected function redirectTo(\Illuminate\Http\Request $request): ?string
    {
        if (! $request->expectsJson()) {
            return route('admin.login');
        }

        return null;
    }
}
