@extends('layouts.app')

@section('title')@yield('page-title', '管理') | MyBuild 管理@endsection

@section('body-class', 'bg-gray-100 text-gray-900 min-h-screen flex')

@section('body')

    {{-- ─── サイドバー ─────────────────────────────────────── --}}
    <aside class="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">

        {{-- ロゴ --}}
        <div class="px-5 py-5 border-b border-gray-200">
            <span class="text-base font-extrabold text-indigo-600 tracking-tight">MyBuild</span>
            <p class="text-xs text-gray-400 mt-0.5">管理者ポータル</p>
        </div>

        {{-- ナビゲーション --}}
        <nav class="flex-1 px-3 py-4 space-y-0.5">
            <a href="{{ route('admin.dashboard') }}"
               class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      {{ request()->routeIs('admin.dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100' }}">
                ダッシュボード
            </a>
            <a href="#"
               class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      {{ request()->routeIs('admin.cars.*') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100' }}">
                車両管理
            </a>
            <a href="#"
               class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      {{ request()->routeIs('admin.makers.*') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100' }}">
                メーカー管理
            </a>
            <a href="#"
               class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      {{ request()->routeIs('admin.parts.*') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100' }}">
                パーツ管理
            </a>
            <a href="{{ route('admin.users.index') }}"
               class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      {{ request()->routeIs('admin.users.*') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100' }}">
                ユーザー管理
            </a>
            <a href="#"
               class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      {{ request()->routeIs('admin.import*') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100' }}">
                CSVインポート
            </a>
        </nav>

        {{-- 管理者情報 + ログアウト --}}
        <div class="px-3 py-4 border-t border-gray-200">
            <div class="px-3 mb-2">
                <p class="text-xs text-gray-400">管理者</p>
                <p class="text-sm font-semibold text-gray-700 truncate">
                    {{ Auth::guard('admin')->user()?->name }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                    {{ Auth::guard('admin')->user()?->email }}
                </p>
            </div>
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit"
                        class="w-full text-left px-3 py-2 rounded-md text-sm text-gray-600
                               hover:bg-gray-100 transition-colors">
                    ログアウト
                </button>
            </form>
        </div>
    </aside>

    {{-- ─── メインコンテンツ ─────────────────────────────────── --}}
    <div class="flex-1 flex flex-col min-w-0">

        {{-- ページヘッダー --}}
        <header class="bg-white border-b border-gray-200 px-8 py-4">
            <h1 class="text-lg font-bold text-gray-800">@yield('page-title', 'ダッシュボード')</h1>
        </header>

        {{-- フラッシュメッセージ --}}
        @if (session('success'))
            <div class="mx-8 mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
                {{ session('success') }}
            </div>
        @endif
        @if (session('error'))
            <div class="mx-8 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {{ session('error') }}
            </div>
        @endif

        <main class="flex-1 px-8 py-6">
            @yield('content')
        </main>
    </div>

    @yield('scripts')

@endsection
