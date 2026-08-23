@extends('layouts.admin')

@section('title', 'ユーザー管理')
@section('page-title', 'ユーザー管理')

@section('content')

    {{-- ─── 検索バー ─────────────────────────────────────────── --}}
    <form method="GET" action="{{ route('admin.users.index') }}" class="mb-6">
        <div class="flex gap-3">
            <input
                type="text"
                name="search"
                value="{{ $filters['search'] ?? '' }}"
                placeholder="名前・メールアドレスで検索..."
                class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <button
                type="submit"
                class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white
                       hover:bg-indigo-700 transition-colors">
                検索
            </button>
            @if (!empty($filters['search']))
                <a href="{{ route('admin.users.index') }}"
                   class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600
                          hover:bg-gray-100 transition-colors">
                    クリア
                </a>
            @endif
        </div>
    </form>

    {{-- ─── 件数 ──────────────────────────────────────────────── --}}
    <p class="mb-3 text-sm text-gray-500">
        {{ $users->total() }} 件中
        {{ $users->firstItem() ?? 0 }}〜{{ $users->lastItem() ?? 0 }} 件表示
    </p>

    {{-- ─── ユーザー一覧テーブル ─────────────────────────────── --}}
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500">
                    <th class="px-5 py-3 font-medium">ID</th>
                    <th class="px-5 py-3 font-medium">名前</th>
                    <th class="px-5 py-3 font-medium">メールアドレス</th>
                    <th class="px-5 py-3 font-medium text-center">お気に入り数</th>
                    <th class="px-5 py-3 font-medium">登録日時</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @forelse ($users as $user)
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-5 py-3.5 text-gray-400">{{ $user->id }}</td>
                        <td class="px-5 py-3.5 font-medium text-gray-800">{{ $user->name }}</td>
                        <td class="px-5 py-3.5 text-gray-600">{{ $user->email }}</td>
                        <td class="px-5 py-3.5 text-center">
                            @if ($user->favorites_count > 0)
                                <span class="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5
                                             text-xs font-semibold text-indigo-600">
                                    {{ $user->favorites_count }} 台
                                </span>
                            @else
                                <span class="text-gray-400">—</span>
                            @endif
                        </td>
                        <td class="px-5 py-3.5 text-gray-400">
                            {{ $user->created_at->format('Y-m-d H:i') }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-5 py-12 text-center text-sm text-gray-400">
                            ユーザーが見つかりません
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- ─── ページネーション ───────────────────────────────────── --}}
    @if ($users->hasPages())
        <div class="mt-6 flex items-center justify-between">
            <p class="text-xs text-gray-500">
                全 {{ $users->total() }} 件 / {{ $users->lastPage() }} ページ
            </p>
            <div class="flex gap-1">
                {{-- 前へ --}}
                @if ($users->onFirstPage())
                    <span class="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-300">
                        &laquo; 前
                    </span>
                @else
                    <a href="{{ $users->previousPageUrl() }}"
                       class="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600
                              hover:bg-gray-100 transition-colors">
                        &laquo; 前
                    </a>
                @endif

                {{-- ページ番号 --}}
                @foreach ($users->getUrlRange(max(1, $users->currentPage() - 2), min($users->lastPage(), $users->currentPage() + 2)) as $page => $url)
                    @if ($page === $users->currentPage())
                        <span class="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                            {{ $page }}
                        </span>
                    @else
                        <a href="{{ $url }}"
                           class="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600
                                  hover:bg-gray-100 transition-colors">
                            {{ $page }}
                        </a>
                    @endif
                @endforeach

                {{-- 次へ --}}
                @if ($users->hasMorePages())
                    <a href="{{ $users->nextPageUrl() }}"
                       class="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600
                              hover:bg-gray-100 transition-colors">
                        次 &raquo;
                    </a>
                @else
                    <span class="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-300">
                        次 &raquo;
                    </span>
                @endif
            </div>
        </div>
    @endif

@endsection
