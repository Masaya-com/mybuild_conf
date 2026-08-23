@extends('layouts.app')

@section('body-class', 'bg-gray-50 text-gray-900 min-h-screen flex flex-col')

@section('body')

    {{-- ─── ナビゲーション ─────────────────────────────────── --}}
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center h-14 gap-6">

                {{-- ロゴ --}}
                <a href="{{ route('home') }}"
                   class="flex items-center gap-2 text-blue-600 font-extrabold text-lg tracking-tight shrink-0">
                    <span class="inline-block w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    MyBuild
                </a>

                {{-- 主要ナビリンク --}}
                <div class="hidden sm:flex items-center gap-1 text-sm">
                    <a href="{{ route('home') }}"
                       class="px-3 py-1.5 rounded-md transition-colors
                              {{ request()->routeIs('home') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' }}">
                        ホーム
                    </a>
                    {{--
                    <a href="{{ route('ranking.index') }}"
                       class="px-3 py-1.5 rounded-md transition-colors
                              {{ request()->routeIs('ranking.*') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' }}">
                        ランキング
                    </a>
                    <a href="{{ route('cars.index') }}"
                       class="px-3 py-1.5 rounded-md transition-colors
                              {{ request()->routeIs('cars.*') ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' }}">
                        車を探す
                    </a>
                    --}}
                </div>

                <div class="flex-1"></div>

                {{-- 右側メニュー --}}
                <div class="flex items-center gap-3 text-sm">
                    @auth
                        {{--
                        <a href="{{ route('favorites.index') }}"
                           class="flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors
                                  {{ request()->routeIs('favorites.*') ? 'text-yellow-600 font-semibold bg-yellow-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' }}">
                            <span>★</span>
                            <span class="hidden sm:inline">お気に入り</span>
                        </a>
                        --}}
                        <span class="text-gray-400 text-xs hidden sm:inline">{{ Auth::user()->name }}</span>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit"
                                    class="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                ログアウト
                            </button>
                        </form>
                    @else
                        <a href="{{ route('login') }}"
                           class="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                            ログイン
                        </a>
                    @endauth
                </div>

                {{-- スマホ用ハンバーガー --}}
                <button id="nav-toggle"
                        class="sm:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
                        aria-label="メニュー">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

            </div>

            {{-- スマホ用ドロワー --}}
            <div id="nav-drawer" class="sm:hidden hidden pb-3 border-t border-gray-100 mt-1">
                <div class="flex flex-col gap-1 pt-2 text-sm">
                    <a href="{{ route('home') }}" class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">ホーム</a>
                    @auth
                        <a href="#" class="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">★ お気に入り</a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    {{-- ─── フラッシュメッセージ ────────────────────────────── --}}
    @if (session('success'))
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
            <div class="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
                {{ session('success') }}
            </div>
        </div>
    @endif
    @if (session('error'))
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
            <div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {{ session('error') }}
            </div>
        </div>
    @endif

    {{-- ─── メインコンテンツ ─────────────────────────────────── --}}
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        @yield('content')
    </main>

    {{-- 比較バースロット --}}
    @yield('compare-bar')

    <script>
        document.getElementById('nav-toggle')?.addEventListener('click', function () {
            document.getElementById('nav-drawer')?.classList.toggle('hidden');
        });
    </script>

    @yield('scripts')

@endsection
