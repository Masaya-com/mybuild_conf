# 車性能比較アプリ 実行計画

## 現在の進捗（完了済み）

| 項目 | 状態 |
|---|---|
| Docker環境（PHP 8.4 / PostgreSQL 16 / pgAdmin4 / NVM + Node 20） | ✅ 完了 |
| Dockerfile更新（pdo_pgsql, NVM, Node.js, 000-default.conf） | ✅ 完了 |
| docker-compose.yml（app / postgres / pgadmin） | ✅ 完了 |
| DBマイグレーション（makers / cars / parts / car_parts / user_favorites） | ✅ 完了 |
| Laravelモデル（Maker / Car / Part / UserFavorite） | ✅ 完了 |
| シーダー（CSV → DB 投入済み：15台 / 79パーツ / 紐付け） | ✅ 完了 |
| package.json（Vue 3 / Pinia / Chart.js / vue-chartjs） | ✅ 完了 |
| vite.config.js（Vue プラグイン追加） | ✅ 完了 |
| inertia-laravel インストール済み（不使用・削除可） | ⚠️ 任意削除 |

---

## アクセス情報

| サービス | URL | 備考 |
|---|---|---|
| アプリ | http://localhost:8080 | |
| pgAdmin4 | http://localhost:5050 | admin@example.com / admin |
| PostgreSQL | localhost:5432 | mybuild / mybuild / mybuild |

pgAdmin4 でのDB接続設定：ホスト = `postgres`（コンテナ名）

---

## 技術スタック方針

- **ルート・ミドルウェア** → Laravel標準（web.php）
- **画面描画** → Blade テンプレート（.blade.php）
- **インタラクティブ部分** → Vue 3 コンポーネント（.vue）を Blade に埋め込む
- **スタイル** → Tailwind CSS v4
- **グラフ** → Chart.js + vue-chartjs
- **状態管理** → Pinia（比較カート）

> **方針：** まず「車同士の性能比較」に絞ってデプロイする。
> パーツ関連のDB・モデルはそのまま保持し、第二弾で追加する。

---

## フェーズ1 実行計画（車性能比較のみ）

---

### Day 1 — npm インストール + Bladeレイアウト + 認証（約1時間）

#### ゴール
- npm パッケージをインストールしてビルドが通ること
- ログイン・登録・ログアウトが動作すること

#### 手順

```bash
# コンテナ内で npm インストール
docker exec -w /var/www/html mybuild_app npm install
docker exec -w /var/www/html mybuild_app npm run build
```

#### 作成するファイル

**`resources/js/app.js`**（Vue 3 マウントのエントリーポイント）

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

window.mountVue = function (component, elementId, props = {}) {
  const app = createApp(component, props)
  app.use(createPinia())
  app.mount(`#${elementId}`)
}
```

**`resources/views/layouts/app.blade.php`**（共通レイアウト）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title', '車性能比較') | CarComp</title>
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50 text-gray-900">
  <nav><!-- ロゴ・メニュー・ログイン状態 --></nav>
  <main>@yield('content')</main>
  @stack('scripts')
</body>
</html>
```

**`app/Http/Controllers/Auth/LoginController.php`**

```php
<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function showForm() { return view('auth.login'); }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);
        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }
        return back()->withErrors(['email' => 'メールアドレスまたはパスワードが正しくありません。']);
    }
}
```

**`app/Http/Controllers/Auth/RegisterController.php`**

```php
<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function showForm() { return view('auth.register'); }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        Auth::login($user);
        return redirect('/');
    }
}
```

**`routes/web.php`**

```php
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Auth;

Route::middleware('guest')->group(function () {
    Route::get('/login',     [LoginController::class,    'showForm'])->name('login');
    Route::post('/login',    [LoginController::class,    'login']);
    Route::get('/register',  [RegisterController::class, 'showForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->middleware('auth')->name('logout');
```

**`resources/views/auth/login.blade.php`** と **`register.blade.php`**
→ Tailwind でスタイリングしたシンプルなフォーム

---

### Day 2 — ホームページ + 車一覧ページ（約1時間）

#### ゴール
- ホーム画面（検索バー・ランキングTOP5プレビュー）
- 車一覧（カードグリッド・フィルターサイドバー）

#### 作成するファイル

**`app/Http/Controllers/CarController.php`**

```php
<?php
namespace App\Http\Controllers;
use App\Models\Car;
use App\Models\Maker;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function home()
    {
        $topBySpeed = Car::with('maker')->orderByDesc('top_speed_kmh')->limit(5)->get();
        return view('home', compact('topBySpeed'));
    }

    public function index(Request $request)
    {
        $query = Car::with('maker');
        if ($request->filled('maker'))      { $query->where('maker_id', $request->maker); }
        if ($request->filled('drive_type')) { $query->where('drive_type', $request->drive_type); }
        if ($request->filled('fuel_type'))  { $query->where('fuel_type', $request->fuel_type); }
        if ($request->filled('year_from'))  { $query->where('year', '>=', $request->year_from); }
        if ($request->filled('year_to'))    { $query->where('year', '<=', $request->year_to); }
        if ($request->filled('price_max'))  { $query->where('price_man_yen', '<=', $request->price_max); }

        $cars   = $query->orderBy('maker_id')->orderBy('model')->orderBy('year')->paginate(12);
        $makers = Maker::all();
        return view('cars.index', compact('cars', 'makers'));
    }

    public function show(Car $car)
    {
        $car->load('maker');
        return view('cars.show', compact('car'));
    }
}
```

**ルート追加（`routes/web.php`）**

```php
use App\Http\Controllers\CarController;

Route::get('/',           [CarController::class, 'home'])->name('home');
Route::get('/cars',       [CarController::class, 'index'])->name('cars.index');
Route::get('/cars/{car}', [CarController::class, 'show'])->name('cars.show');
```

**Blade ビュー**
- `resources/views/home.blade.php` — 検索バー + TOP5プレビュー
- `resources/views/cars/index.blade.php` — 12件グリッド + フィルターサイドバー
- `resources/views/cars/show.blade.php` — スペック表 + レーダーチャート埋め込み

---

### Day 3 — 車詳細 + レーダーチャート Vue コンポーネント（約1時間）

#### ゴール
- 車詳細にスペック全表示
- Vue 3 のレーダーチャートで視覚化

#### 作成するファイル

**`resources/js/components/RadarChart.vue`**

```vue
<script setup>
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from 'chart.js'
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({ car: Object })

const normalize = (val, min, max) => Math.round(((val - min) / (max - min)) * 100)

const chartData = computed(() => ({
  labels: ['出力(ps)', 'トルク(Nm)', 'ハンドリング', '最高速', '加速', '燃費'],
  datasets: [{
    label: `${props.car.model} ${props.car.grade}`,
    data: [
      normalize(props.car.max_power_ps,            0,   500),
      normalize(props.car.max_torque_nm,            0,   600),
      props.car.handling_score * 10,
      normalize(props.car.top_speed_kmh,          150,   350),
      normalize(10 - props.car.acceleration_0_100_sec, 0, 10) * 10,
      normalize(props.car.fuel_efficiency_km_per_l, 0,    25) * 4,
    ],
    fill: true,
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderColor:     'rgba(59,130,246,1)',
  }]
}))

const chartOptions = { scales: { r: { min: 0, max: 100 } } }
</script>

<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>
```

**Blade 側での呼び出し（`cars/show.blade.php` に追記）**

```html
<div id="radar-chart" style="max-width:400px"></div>
@push('scripts')
<script type="module">
  import { createApp } from '/build/assets/app.js'
  // mountVue はapp.jsでwindowに登録済み
  // ※ビルド後の実パスはmanifest.jsonで確認すること
</script>
@endpush
```

---

### Day 4 — 比較機能（フローティングバー + 比較ページ）（約1時間）

#### ゴール
- 一覧・詳細の「比較に追加」ボタンで最大2台を選択
- 画面下部のフローティングバーに追加済み台数を表示
- 比較ページで2台をサイドバイサイド + レーダーチャート重ね合わせ

#### 作成するファイル

**`resources/js/stores/compareStore.js`**（Pinia）

```js
import { defineStore } from 'pinia'

export const useCompareStore = defineStore('compare', {
  state: () => ({ cars: [] }),
  getters: {
    isFull: (s) => s.cars.length >= 2,
    isAdded: (s) => (id) => s.cars.some(c => c.id === id),
  },
  actions: {
    toggle(car) {
      const idx = this.cars.findIndex(c => c.id === car.id)
      if (idx >= 0) {
        this.cars.splice(idx, 1)
      } else if (this.cars.length < 2) {
        this.cars.push(car)
      }
    },
    clear() { this.cars = [] }
  },
  persist: true,   // ページ遷移をまたいで保持（localStorage）
})
```

**`resources/js/components/CompareBar.vue`**

```vue
<!-- 2台選択されたら「比較する」ボタンを表示 -->
<!-- /compare?ids=1,2 へGETリダイレクト -->
```

**`app/Http/Controllers/CompareController.php`**

```php
public function show(Request $request)
{
    $ids  = array_filter(explode(',', $request->query('ids', '')));
    $cars = Car::with('maker')->whereIn('id', $ids)->get();
    return view('compare.show', compact('cars'));
}
```

**ルート追加**

```php
use App\Http\Controllers\CompareController;
Route::get('/compare', [CompareController::class, 'show'])->name('compare.show');
```

**`resources/views/compare/show.blade.php`**
- 2台のスペックを横並び表示
- 数値が優れている方を緑・劣る方を赤でハイライト
- レーダーチャートを2系列で重ね合わせ

---

### Day 5 — ランキングページ（約1時間）

#### ゴール
- 項目タブ（最高速 / 0-100加速 / 最高出力 / 最大トルク / ハンドリング / 燃費）
- 各指標の上位10台をリスト表示

#### 作成するファイル

**`app/Http/Controllers/RankingController.php`**

```php
<?php
namespace App\Http\Controllers;
use App\Models\Car;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    private const METRICS = [
        'top_speed_kmh'            => ['label' => '最高速度',   'unit' => 'km/h', 'dir' => 'desc'],
        'acceleration_0_100_sec'   => ['label' => '0-100加速',  'unit' => '秒',   'dir' => 'asc'],
        'max_power_ps'             => ['label' => '最高出力',   'unit' => 'ps',   'dir' => 'desc'],
        'max_torque_nm'            => ['label' => '最大トルク', 'unit' => 'Nm',   'dir' => 'desc'],
        'handling_score'           => ['label' => 'ハンドリング','unit' => 'pt',  'dir' => 'desc'],
        'fuel_efficiency_km_per_l' => ['label' => '燃費',       'unit' => 'km/L', 'dir' => 'desc'],
    ];

    public function index(Request $request)
    {
        $metric  = $request->get('metric', 'top_speed_kmh');
        $metrics = self::METRICS;
        if (!array_key_exists($metric, $metrics)) { $metric = 'top_speed_kmh'; }

        $direction = $metrics[$metric]['dir'];
        $cars = Car::with('maker')->orderBy($metric, $direction)->limit(10)->get();

        return view('ranking.index', compact('cars', 'metric', 'metrics'));
    }
}
```

**ルート追加**

```php
use App\Http\Controllers\RankingController;
Route::get('/ranking', [RankingController::class, 'index'])->name('ranking.index');
```

**`resources/views/ranking/index.blade.php`**
- タブ切り替えで metric を変更（GETパラメータ）
- 順位・メーカー・モデル・年式・スコアをリスト表示

---

### Day 6 — お気に入り機能（約1時間）

#### ゴール
- 車詳細・一覧の★ボタンでお気に入り登録（ログイン必要）
- お気に入り一覧ページ

#### 作成するファイル

**`app/Http/Controllers/FavoriteController.php`**

```php
<?php
namespace App\Http\Controllers;
use App\Models\Car;
use App\Models\UserFavorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index()
    {
        $cars = auth()->user()
            ->favorites()       // User モデルに hasMany(UserFavorite) を追加
            ->with('car.maker')
            ->get()
            ->pluck('car');
        return view('favorites.index', compact('cars'));
    }

    public function toggle(Car $car)
    {
        $existing = UserFavorite::where('user_id', auth()->id())
                                ->where('car_id', $car->id)
                                ->first();
        if ($existing) {
            $existing->delete();
            $isFavorited = false;
        } else {
            UserFavorite::create(['user_id' => auth()->id(), 'car_id' => $car->id]);
            $isFavorited = true;
        }
        return response()->json(['favorited' => $isFavorited]);
    }
}
```

**ルート追加**

```php
use App\Http\Controllers\FavoriteController;
Route::middleware('auth')->group(function () {
    Route::get('/favorites',          [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/{car}',   [FavoriteController::class, 'toggle'])->name('favorites.toggle');
});
```

**`resources/js/components/FavoriteButton.vue`**

```vue
<!-- ★ボタン。クリックで axios POST → favorited を反転して表示切替 -->
```

---

### Day 7 — 仕上げ・動作確認・デプロイ準備（約1時間）

#### チェックリスト

- [ ] `npm run build` でビルドエラーがないこと
- [ ] ログイン → 車一覧 → 車詳細 の導線が動くこと
- [ ] 2台選んで比較ページに遷移し差分ハイライトが表示されること
- [ ] ランキングタブが切り替わること
- [ ] お気に入り登録・解除ができること（未ログイン時はログインページへ）
- [ ] pgAdmin4でデータが正しく入っていること
- [ ] `.env` の `APP_ENV=production` / `APP_DEBUG=false` を確認

---

## フェーズ1 完成後のファイル構成

```
mybuild/
├── app/Http/Controllers/
│   ├── Auth/
│   │   ├── LoginController.php
│   │   └── RegisterController.php
│   ├── CarController.php
│   ├── CompareController.php
│   ├── FavoriteController.php
│   └── RankingController.php
├── resources/
│   ├── js/
│   │   ├── app.js
│   │   ├── components/
│   │   │   ├── RadarChart.vue
│   │   │   ├── CompareBar.vue
│   │   │   └── FavoriteButton.vue
│   │   └── stores/
│   │       └── compareStore.js
│   └── views/
│       ├── layouts/app.blade.php
│       ├── auth/{login,register}.blade.php
│       ├── home.blade.php
│       ├── cars/{index,show}.blade.php
│       ├── compare/show.blade.php
│       ├── ranking/index.blade.php
│       └── favorites/index.blade.php
└── routes/web.php
```

---

## よく使うコマンド

```bash
# コンテナに入る
docker exec -it mybuild_app bash

# フロントエンドのビルド（開発時：ホットリロード）
docker exec -w /var/www/html mybuild_app npm run dev

# フロントエンドのビルド（本番）
docker exec -w /var/www/html mybuild_app npm run build

# マイグレーション（テーブル再作成 + シーダー）
docker exec mybuild_app php /var/www/html/artisan migrate:fresh --seed

# ルート一覧確認
docker exec mybuild_app php /var/www/html/artisan route:list

# キャッシュクリア
docker exec mybuild_app php /var/www/html/artisan cache:clear
docker exec mybuild_app php /var/www/html/artisan config:clear
docker exec mybuild_app php /var/www/html/artisan view:clear
```

---

---

# フェーズ2 実行計画（パーツ交換シミュレーション追加）

> フェーズ1のデプロイ後に追加する。DBのテーブル（parts / car_parts）はすでに存在しデータも投入済みのため、追加の DB 作業は不要。

---

### Day A — 車詳細にパーツ選択UIを追加（約1時間）

#### ゴール
- 車詳細ページのスペック表の下にパーツ選択エリアを追加
- カテゴリ別プルダウン（エンジン / マフラー / サスペンション / ブレーキ / タイヤ など）
- パーツを変えるとリアルタイムに性能数値が更新される

#### 修正するファイル

**`app/Http/Controllers/CarController.php`の `show` を更新**

```php
public function show(Car $car)
{
    $car->load('maker');
    $partsByCategory = $car->parts()->get()->groupBy('part_category');
    return view('cars.show', compact('car', 'partsByCategory'));
}
```

**`resources/js/components/PartSimulator.vue`（新規）**

```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  car: Object,
  partsByCategory: Object,   // { exhaust: [...], suspension: [...], ... }
})

const selectedParts = ref({})

const simulated = computed(() => {
  const s = { ...props.car }
  Object.values(selectedParts.value).forEach(part => {
    if (!part) return
    s.max_power_ps             += part.power_delta_ps
    s.max_torque_nm            += part.torque_delta_nm
    s.acceleration_0_100_sec   += part.acceleration_delta_sec
    s.top_speed_kmh            += part.top_speed_delta_kmh
    s.fuel_efficiency_km_per_l += part.fuel_efficiency_delta
    s.weight_kg                += part.weight_delta_kg
    s.handling_score           += part.handling_score_delta
    s.braking_distance_100_0_m += part.braking_distance_delta_m
  })
  return s
})

// 差分の符号（+ / −）と色クラスを返すヘルパー
const delta = (key) => simulated.value[key] - props.car[key]
</script>

<template>
  <!-- カテゴリ別セレクトボックス -->
  <!-- シミュレーション後の各数値（差分を色でハイライト） -->
  <!-- 「この構成で比較に追加」ボタン → compareStore に push -->
</template>
```

---

### Day B — パーツ変更後の比較ページ対応（約1時間）

#### ゴール
- パーツ変更後の仮想スペックを持つ車を比較ページで扱えるようにする
- 「純正」と「カスタム」を並べて比較できる

#### 対応方針

比較ページへの遷移は Pinia の `compareStore` 経由で行う。
カスタム構成は `{ ...car, parts: selectedParts }` の形で store に保持し、
比較ページでは store の値を Vue コンポーネントで直接描画する（サーバーサイドは不要）。

**修正するファイル**
- `compareStore.js` — car に `customStats` フィールドを持てるよう拡張
- `compare/show.blade.php` — Blade の静的表示から Vue コンポーネントに切り替え
- `resources/js/components/CompareTable.vue`（新規）— 2台のスペックを動的に比較

---

### Day C — 仕上げ・動作確認（約1時間）

- [ ] パーツ選択で数値がリアルタイムに変わること
- [ ] カスタム構成を比較カートに追加して比較ページに遷移できること
- [ ] 純正同士・純正とカスタム・カスタム同士の3パターンで動作すること
- [ ] `npm run build` でエラーがないこと
