@extends('layouts.app')

@section('title', '管理者ログイン')

@section('body-class', 'bg-gray-100 min-h-screen flex items-center justify-center')

@section('body')

    <div class="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">

        <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-indigo-600 tracking-tight">MyBuild</h1>
            <p class="text-sm text-gray-400 mt-1">管理者ポータル</p>
        </div>

        @if ($errors->any())
            <div class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('admin.login') }}" novalidate>
            @csrf

            <div class="mb-5">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                </label>
                <input
                    id="email" type="email" name="email"
                    value="{{ old('email') }}"
                    required autofocus autocomplete="email"
                    class="w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                           {{ $errors->has('email') ? 'border-red-400 bg-red-50' : 'border-gray-300' }}"
                >
                @error('email')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                    パスワード
                </label>
                <input
                    id="password" type="password" name="password"
                    required autocomplete="current-password"
                    class="w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                           {{ $errors->has('password') ? 'border-red-400 bg-red-50' : 'border-gray-300' }}"
                >
                @error('password')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <button
                type="submit"
                class="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white
                       hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                ログイン
            </button>
        </form>

    </div>

@endsection
