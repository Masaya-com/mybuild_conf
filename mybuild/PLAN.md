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
- **状態管理** → Pinia（比較カート・パーツ選択）

---

## Day 1 — npm インストール + Bladeレイアウト + 認証ルート（約1時間）

### ゴール
- npm パッケージをインストールしてビルドが通ること
- ログイン・登録・ログアウトが動作すること

### 手順

```bash
# コンテナ内で npm インストール
docker exec -w /var/www/html mybuild_app npm install
docker exec -w /var/www/html mybuild_app npm run build
```

### 作成するファイル

#### 1. `resources/js/app.js`（Vue 3 マウントのエントリーポイント）

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vueコンポーネントを各ページでマウントする関数
window.mountVue = function (component, elementId, props = {}) {
  const app = createApp(component, props)
  app.use(createPinia())
  app.mount(`#${elementId}`)
}
```

#### 2. `resources/views/layouts/app.blade.php`（共通レイアウト）

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
  <!-- ナビゲーションバー -->
  <nav>
    <!-- ロゴ・メニュー・ログイン状態 -->
  </nav>
  <main>
    @yield('content')
  </main>
  @stack('scripts')
</body>
</html>
```

#### 3. `app/Http/Controllers/Auth/LoginController.php`

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

#### 4. `app/Http/Controllers/Auth/RegisterController.php`

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

#### 5. `routes/web.php` に追加するルート

```php
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

// 認証
Route::middleware('guest')->group(function () {
    Route::get('/login',    [LoginController::class,    'showForm'])->name('login');
    Route::post('/login',   [LoginController::class,    'login']);
    Route::get('/register', [RegisterController::class, 'showForm'])->name('register');
    Route::post('/register',[RegisterController::class, 'register']);
});
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->middleware('auth')->name('logout');
```

#### 6. `resources/views/auth/login.blade.php` と `register.blade.php`

シンプルなフォームをTailwindでスタイリング。

---

## Day 2 — ホームページ + 車一覧ページ（約1時間）

### ゴール
- ホーム画面（検索バー・ランキングTOP5プレビュー）
- 車一覧（カードグリッド・フィルターサイドバー）

### 作成するファイル

#### `app/Http/Controllers/CarController.php`

```php
<?php
namespace App\Http\Controllers;
use App\Models\Car;
use App\Models\Maker;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::with('maker');

        if ($request->filled('maker'))        { $query->where('maker_id', $request->maker); }
        if ($request->filled('drive_type'))   { $query->where('drive_type', $request->drive_type); }
        if ($request->filled('fuel_type'))    { $query->where('fuel_type', $request->fuel_type); }
        if ($request->filled('year_from'))    { $query->where('year', '>=', $request->year_from); }
        if ($request->filled('year_to'))      { $query->where('year', '<=', $request->year_to); }
        if ($request->filled('price_max'))    { $query->where('price_man_yen', '<=', $request->price_max); }

        $cars   = $query->orderBy('maker_id')->orderBy('model')->orderBy('year')->paginate(12);
        $makers = Maker::all();

        return view('cars.index', compact('cars', 'makers'));
    }

    public function show(Car $car)
    {
        $car->load(['maker', 'parts']);
        $partsByCategory = $car->parts->groupBy('part_category');
        return view('cars.show', compact('car', 'partsByCategory'));
    }
}
```

#### ルート追加

```php
Route::get('/',        [CarController::class, 'indexHome'])->name('home');
Route::get('/cars',    [CarController::class, 'index'])->name('cars.index');
Route::get('/cars/{car}', [CarController::class, 'show'])->name('cars.show');
```

#### Blade ビュー
- `resources/views/home.blade.php` — 検索バー + ランキングTOP5
- `resources/views/cars/index.blade.php` — 12件グリッド + フィルターサイドバー
- `resources/views/cars/show.blade.php` — スペック表 + Vue コンポーネント埋め込み

---

## Day 3 — 車詳細ページ + レーダーチャート Vue コンポーネント（約1時間）

### ゴール
- 車詳細にスペック全表示
- レーダーチャートで視覚化

### 作成するファイル

#### `resources/js/components/RadarChart.vue`

```vue
<script setup>
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
  car: Object,      // { max_power_ps, max_torque_nm, handling_score, ... }
})

const data = computed(() => ({
  labels: ['出力', 'トルク', 'ハンドリング', '最高速', '加速', '燃費'],
  datasets: [{
    label: props.car.model + ' ' + props.car.grade,
    data: [
      normalize(props.car.max_power_ps, 0, 500),
      normalize(props.car.max_torque_nm, 0, 600),
      props.car.handling_score * 10,
      normalize(props.car.top_speed_kmh, 150, 350),
      normalize(10 - props.car.acceleration_0_100_sec, 0, 10) * 10,
      normalize(props.car.fuel_efficiency_km_per_l, 0, 25) * 4,
    ],
    fill: true,
  }]
}))
</script>
```

#### `resources/js/app.js` にコンポーネント登録

```js
import RadarChart from '@/components/RadarChart.vue'
// Blade側で <div id="radar-chart"></div> にマウント
```

#### Blade 側での呼び出し

```html
<div id="radar-chart"></div>
@push('scripts')
<script type="module">
  import RadarChart from '/build/assets/RadarChart.js'  // Viteビルド後
  mountVue(RadarChart, 'radar-chart', { car: @json($car) })
</script>
@endpush
```

---

## Day 4 — パーツ交換シミュレーション（約1時間）

### ゴール
- 車詳細ページでカテゴリ別プルダウンからパーツ選択
- 選択するとリアルタイムに性能数値が更新

### 作成するファイル

#### `resources/js/components/PartSimulator.vue`

```vue
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ car: Object, partsByCategory: Object })

const selectedParts = ref({})  // { exhaust: partObj, suspension: partObj, ... }

const simulatedStats = computed(() => {
  const base = { ...props.car }
  Object.values(selectedParts.value).forEach(part => {
    if (!part) return
    base.max_power_ps            += part.power_delta_ps
    base.max_torque_nm           += part.torque_delta_nm
    base.acceleration_0_100_sec  += part.acceleration_delta_sec
    base.top_speed_kmh           += part.top_speed_delta_kmh
    base.fuel_efficiency_km_per_l += part.fuel_efficiency_delta
    base.weight_kg               += part.weight_delta_kg
    base.handling_score          += part.handling_score_delta
    base.braking_distance_100_0_m += part.braking_distance_delta_m
  })
  return base
})
</script>

<template>
  <!-- カテゴリ別プルダウン -->
  <!-- シミュレーション後の数値表示（元の値との差分をハイライト） -->
  <!-- 「比較に追加」ボタン → Pinia ストアに保存 -->
</template>
```

#### `resources/js/stores/compareStore.js`（Pinia）

```js
import { defineStore } from 'pinia'
export const useCompareStore = defineStore('compare', {
  state: () => ({ cars: [] }),  // 最大2台
  actions: {
    addCar(car) {
      if (this.cars.length < 2 && !this.cars.find(c => c.id === car.id)) {
        this.cars.push(car)
      }
    },
    removeCar(carId) { this.cars = this.cars.filter(c => c.id !== carId) },
    clear() { this.cars = [] }
  }
})
```

---

## Day 5 — 比較ページ（約1時間）

### ゴール
- フローティングバー（画面下部に比較カートを表示）
- 比較ページで2台をサイドバイサイド表示

### 作成するファイル

#### `resources/js/components/CompareBar.vue`

- 全ページの Blade レイアウトに埋め込む
- Pinia ストアから台数を監視してフローティング表示
- 「比較する」ボタン → `/compare?ids=1,2` にGETリクエスト

#### `app/Http/Controllers/CompareController.php`

```php
public function show(Request $request)
{
    $ids  = explode(',', $request->query('ids', ''));
    $cars = Car::with(['maker', 'parts'])->whereIn('id', $ids)->get();
    return view('compare.show', compact('cars'));
}
```

#### `resources/views/compare/show.blade.php`

```
2台のスペックを横並びで表示。
差がある項目を色でハイライト（優れている方を緑・劣っている方を赤）。
レーダーチャートを2系列で重ね合わせ表示。
```

---

## Day 6 — ランキングページ（約1時間）

### ゴール
- 項目タブ（最高速 / 0-100加速 / ハンドリング / トルク / 燃費）
- 各上位10台をリスト表示

### 作成するファイル

#### `app/Http/Controllers/RankingController.php`

```php
public function index(Request $request)
{
    $metric = $request->get('metric', 'top_speed_kmh');
    $allowed = ['top_speed_kmh','max_power_ps','max_torque_nm',
                'handling_score','acceleration_0_100_sec','fuel_efficiency_km_per_l'];

    $direction = in_array($metric, ['acceleration_0_100_sec']) ? 'asc' : 'desc';

    $cars = Car::with('maker')
        ->orderBy($metric, $direction)
        ->limit(10)
        ->get();

    return view('ranking.index', compact('cars', 'metric'));
}
```

---

## Day 7 — お気に入り機能（約1時間）

### ゴール
- 車詳細・一覧の★ボタンでお気に入り登録（ログイン必要）
- お気に入り一覧ページ

### 作成するファイル

#### `app/Http/Controllers/FavoriteController.php`

```php
// POST /favorites/{car}  → 登録 or 解除（トグル）
// GET  /favorites        → 一覧
```

#### `resources/js/components/FavoriteButton.vue`

```vue
<!-- ★ボタン。クリックでAjax POST → 状態を反転 -->
```

---

## Day 8 — 仕上げ・動作確認（約1時間）

### チェックリスト

- [ ] `npm run build` でビルドエラーがないこと
- [ ] ログイン → 車一覧 → 車詳細 の導線が動くこと
- [ ] パーツ選択で数値が変わること
- [ ] 2台選んで比較ページに遷移できること
- [ ] ランキングタブが切り替わること
- [ ] お気に入り登録・解除ができること（未ログイン時はログインページへリダイレクト）
- [ ] pgAdmin4でデータが正しく入っていること

---

## ファイル構成（完成後）

```
mybuild/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   ├── LoginController.php
│   │   │   └── RegisterController.php
│   │   ├── CarController.php
│   │   ├── CompareController.php
│   │   ├── FavoriteController.php
│   │   └── RankingController.php
│   └── Models/
│       ├── Car.php
│       ├── Maker.php
│       ├── Part.php
│       ├── UserFavorite.php
│       └── User.php
├── resources/
│   ├── js/
│   │   ├── app.js
│   │   ├── components/
│   │   │   ├── RadarChart.vue
│   │   │   ├── PartSimulator.vue
│   │   │   ├── CompareBar.vue
│   │   │   └── FavoriteButton.vue
│   │   └── stores/
│   │       └── compareStore.js
│   ├── css/
│   │   └── app.css
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php
│       ├── auth/
│       │   ├── login.blade.php
│       │   └── register.blade.php
│       ├── home.blade.php
│       ├── cars/
│       │   ├── index.blade.php
│       │   └── show.blade.php
│       ├── compare/
│       │   └── show.blade.php
│       ├── ranking/
│       │   └── index.blade.php
│       └── favorites/
│           └── index.blade.php
├── routes/
│   └── web.php
├── database/
│   ├── migrations/ （作成済み）
│   └── seeders/    （作成済み）
├── car_data/       （CSVファイル）
└── PLAN.md         （この計画書）
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

# マイグレーション（テーブル再作成）
docker exec mybuild_app php /var/www/html/artisan migrate:fresh --seed

# ルート一覧確認
docker exec mybuild_app php /var/www/html/artisan route:list

# キャッシュクリア
docker exec mybuild_app php /var/www/html/artisan cache:clear
docker exec mybuild_app php /var/www/html/artisan config:clear
docker exec mybuild_app php /var/www/html/artisan view:clear
```
