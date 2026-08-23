<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function showForm(): View
    {
        return view('auth.login');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            Log::info('ログイン成功', ['user' => Auth::user()->email]);

            return redirect()->intended(route('home'));
        }

        Log::warning('ログイン失敗', ['email' => $request->email]);

        return back()
            ->withInput($request->only('email', 'remember'))
            ->withErrors(['email' => 'メールアドレスまたはパスワードが正しくありません。']);
    }

    public function logout(Request $request): RedirectResponse
    {
        Log::info('ログアウト', ['user' => Auth::user()?->email]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
