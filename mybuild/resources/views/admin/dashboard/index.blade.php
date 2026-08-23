@extends('layouts.admin')

@section('title', 'ダッシュボード')
@section('page-title', 'ダッシュボード')

@section('content')

    {{-- ─── サマリーカード ──────────────────────────────────── --}}
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        @foreach ([
            ['label' => '登録車両',   'value' => $summary['cars'],   'unit' => '台'],
            ['label' => 'メーカー',   'value' => $summary['makers'], 'unit' => '社'],
            ['label' => 'パーツ',     'value' => $summary['parts'],  'unit' => '件'],
            ['label' => 'ユーザー',   'value' => $summary['users'],  'unit' => '名'],
        ] as $card)
            <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <p class="text-xs text-gray-400 mb-1">{{ $card['label'] }}</p>
                <div class="flex items-baseline gap-1">
                    <span class="text-3xl font-extrabold text-indigo-600">{{ $card['value'] }}</span>
                    <span class="text-sm text-gray-400">{{ $card['unit'] }}</span>
                </div>
            </div>
        @endforeach
    </div>

    {{-- ─── 最近追加された車両 + クイックアクション ───────── --}}
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {{-- 最近追加された車両 --}}
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="text-sm font-semibold text-gray-800">最近追加された車両</h2>
            </div>
            @if ($recentCars->isEmpty())
                <p class="px-5 py-8 text-sm text-center text-gray-400">登録された車両はありません</p>
            @else
                <ul class="divide-y divide-gray-100">
                    @foreach ($recentCars as $car)
                        <li class="flex items-center justify-between px-5 py-3">
                            <div>
                                <p class="text-sm font-medium text-gray-800">{{ $car->model }}</p>
                                <p class="text-xs text-gray-400">{{ $car->maker?->name ?? '—' }} · {{ $car->year }}</p>
                            </div>
                            <span class="text-xs text-gray-400">
                                {{ $car->created_at->format('Y-m-d') }}
                            </span>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>

        {{-- クイックアクション --}}
        <div class="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <h2 class="text-sm font-semibold text-gray-800 mb-4">クイックアクション</h2>
            <div class="space-y-2.5">
                <a href="#"
                   class="flex items-center justify-between w-full px-4 py-2.5 rounded-lg
                          bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    車両を新規登録
                    <span class="text-base leading-none">&rarr;</span>
                </a>
                <a href="#"
                   class="flex items-center justify-between w-full px-4 py-2.5 rounded-lg
                          bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors">
                    メーカーを追加
                    <span class="text-base leading-none">&rarr;</span>
                </a>
                <a href="#"
                   class="flex items-center justify-between w-full px-4 py-2.5 rounded-lg
                          bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors">
                    パーツを追加
                    <span class="text-base leading-none">&rarr;</span>
                </a>
                <a href="#"
                   class="flex items-center justify-between w-full px-4 py-2.5 rounded-lg
                          bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors">
                    CSVインポート
                    <span class="text-base leading-none">&rarr;</span>
                </a>
            </div>
        </div>
    </div>

@endsection
