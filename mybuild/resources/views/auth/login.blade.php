@extends('layouts.app')

@section('title', 'ログイン')

@section('body-class', 'bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4')

@section('body')

    {{-- ロゴ --}}
    <a href="{{ route('home') }}"
       class="flex items-center gap-2 text-blue-600 font-extrabold text-xl tracking-tight mb-8">
        <span class="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>
        MyBuild
    </a>

    {{-- ログインカード --}}
    <div class="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8">

        <div class="mb-6">
            <h1 class="text-xl font-bold text-gray-900">ログイン</h1>
            <p class="text-sm text-gray-500 mt-1">MyBuildへようこそ</p>
        </div>

        @if ($errors->any())
            <div class="mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                @foreach ($errors->all() as $error)
                    <p class="text-sm text-red-600">{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" novalidate>
            @csrf

            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
                    メールアドレス
                </label>
                <input
                    id="email" type="email" name="email"
                    value="{{ old('email') }}"
                    required autofocus autocomplete="email"
                    placeholder="you@example.com"
                    class="w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                           {{ $errors->has('email') ? 'border-red-400 bg-red-50' : 'border-gray-300' }}"
                >
            </div>

            <div class="mb-5">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">
                    パスワード
                </label>
                <input
                    id="password" type="password" name="password"
                    required autocomplete="current-password"
                    placeholder="••••••••"
                    class="w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                           {{ $errors->has('password') ? 'border-red-400 bg-red-50' : 'border-gray-300' }}"
                >
            </div>

            <div class="flex items-center gap-2 mb-6">
                <input
                    id="remember" type="checkbox" name="remember"
                    {{ old('remember') ? 'checked' : '' }}
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                >
                <label for="remember" class="text-sm text-gray-600 cursor-pointer select-none">
                    ログイン状態を保持する
                </label>
            </div>

            <button
                type="submit"
                class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                ログイン
            </button>
        </form>
    </div>

    <p class="mt-6 text-xs text-gray-400">
        ※ アカウント登録は管理者が行います
    </p>

@endsection
