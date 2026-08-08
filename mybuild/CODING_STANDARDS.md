# コーディング規約

**対象プロジェクト：** 車性能比較アプリ  
**技術スタック：** Laravel 12 / Vue 3 / Tailwind CSS v4 / Pinia / Chart.js

---

## 1. 共通ルール

- インデント：**スペース4つ**（PHP・Blade）/ **スペース2つ**（JS・Vue・JSON）
- 文字コード：**UTF-8**（BOMなし）
- 改行コード：**LF**
- ファイル末尾は**改行を1つ**入れる
- 1行の最大文字数：**120文字**（コメント含む）
- コメントは**日本語**で記述する（英語でも可、混在は避ける）

---

## 2. PHP / Laravel

### 2-1. 命名規則

| 対象 | スタイル | 例 |
|---|---|---|
| クラス名 | PascalCase | `CarController`, `UserFavorite` |
| メソッド名 | camelCase | `getCarsByMaker()` |
| 変数名 | camelCase | `$fuelEfficiency` |
| 定数 | UPPER_SNAKE_CASE | `MAX_COMPARE_COUNT` |
| DBカラム | snake_case | `max_power_ps` |
| テーブル名 | snake_case（複数形） | `cars`, `car_parts` |

### 2-2. ファイル構成

```
app/
  Http/
    Controllers/    # コントローラー（1機能1クラス）
    Requests/       # フォームリクエスト（バリデーションはここに集約）
  Models/           # Eloquentモデル
  Services/         # ビジネスロジック（Controllerに書かない）
```

### 2-3. コントローラー

- **1メソッドの責務は1つ**に限定する
- バリデーションは必ず `FormRequest` クラスに切り出す
- DBアクセスは **Service クラス** または **Model スコープ** に委譲し、Controller には書かない
- レスポンスは必ず型を明示する

```php
// ✅ 良い例
public function index(Request $request): View
{
    $cars = $this->carService->getFilteredCars($request->validated());
    return view('cars.index', compact('cars'));
}

// ❌ 悪い例（Controllerに直接クエリを書く）
public function index(): View
{
    $cars = Car::where('fuel_type', 'gasoline')->get();
    return view('cars.index', compact('cars'));
}
```

### 2-4. モデル

- `$fillable` を必ず定義する（`$guarded = []` は使用禁止）
- リレーションメソッドには必ず**戻り値型**を明記する
- アクセサ・ミューテタは Laravel 9+ の `Attribute` クラス形式を使用する
- スコープはメソッド名を `scope〇〇` とする

```php
// ✅ 良い例
public function maker(): BelongsTo
{
    return $this->belongsTo(Maker::class);
}
```

### 2-5. マイグレーション

- カラム追加・削除には必ず `down()` を実装する
- カラムの順序：主キー → 外部キー → 必須カラム → NULLableカラム → タイムスタンプ
- インデックスは `_index` サフィックスを付ける（例：`cars_maker_id_index`）

### 2-6. コーディングスタイル

- `Laravel Pint`（PSR-12ベース）を使用し、コミット前に必ず実行する

```bash
./vendor/bin/pint
```

---

## 3. Blade テンプレート

- ロジックは書かない（条件分岐は最小限、ループは許容）
- コンポーネントは `resources/views/components/` に切り出す
- Vue コンポーネントのマウント先 `<div>` には必ず `id` を付与する

```blade
{{-- ✅ 良い例 --}}
<div id="car-compare-app" data-cars="{{ json_encode($cars) }}"></div>

{{-- ❌ 悪い例（Bladeにビジネスロジックを書く）--}}
@if($cars->filter(fn($c) => $c->fuel_type === 'electric')->count() > 3)
```

---

## 4. Vue 3

### 4-1. ファイル・コンポーネント規則

- ファイル名：**PascalCase**（例：`CarCard.vue`, `CompareTable.vue`）
- 1ファイル1コンポーネント
- `<script setup>` 構文を使用する（Options API は使用禁止）

### 4-2. 構成順序

`.vue` ファイル内の記述順序を統一する：

```vue
<script setup>
// 1. import
// 2. props / emits
// 3. store / composable
// 4. リアクティブ変数（ref / computed）
// 5. メソッド
// 6. ライフサイクル
</script>

<template>
  <!-- テンプレート -->
</template>

<!-- styleは原則Tailwind CSSで代替。どうしても必要な場合のみ記述 -->
<style scoped></style>
```

### 4-3. 命名規則

| 対象 | スタイル | 例 |
|---|---|---|
| コンポーネント名 | PascalCase | `CarCard`, `CompareTable` |
| props | camelCase | `maxPowerPs`, `fuelType` |
| emits | kebab-case | `add-to-compare`, `update:modelValue` |
| composable | `use〇〇` | `useCompareCart`, `useCarFilter` |
| Piniaストア | `use〇〇Store` | `useCompareStore` |

### 4-4. Props

- 必ず型定義を行う（`defineProps<{...}>()`）
- 必須かどうかを明示する（任意の場合は `?` を付ける）

```vue
<!-- ✅ 良い例 -->
<script setup lang="ts">
const props = defineProps<{
  car: Car
  isSelected?: boolean
}>()
</script>
```

### 4-5. Pinia ストア

- ストアファイルは `resources/js/stores/` に配置する
- `setup store` 形式（`defineStore`）を使用する
- ストアに **API通信** を直接書かない（`composable` や `service` に切り出す）

```js
// ✅ 良い例
export const useCompareStore = defineStore('compare', () => {
  const selectedCars = ref([])
  const MAX = 3

  function addCar(car) {
    if (selectedCars.value.length >= MAX) return
    selectedCars.value.push(car)
  }

  return { selectedCars, addCar }
})
```

---

## 5. Tailwind CSS v4

- ユーティリティクラスを直接 HTML に記述する（`@apply` は原則禁止）
- クラスの順序：レイアウト → ボックスモデル → タイポグラフィ → 色 → その他
- 繰り返し使うパターンはコンポーネント化して対応する
- カスタムカラー・サイズは `tailwind.config.js` に定義して共有する（マジックナンバー禁止）

```html
<!-- ✅ 良い例 -->
<div class="flex items-center gap-4 p-4 text-sm font-bold text-gray-700 bg-white rounded-lg shadow">

<!-- ❌ 悪い例（style属性でスタイルを書く）-->
<div style="display:flex; padding:16px;">
```

---

## 6. Chart.js / vue-chartjs

- チャートコンポーネントは `resources/js/components/charts/` に配置する
- `data` と `options` は `computed` で定義し、テンプレートをシンプルに保つ
- カラーパレットはプロジェクト共通定数として `resources/js/constants/chartColors.js` に定義する

---

## 7. Git

### 7-1. ブランチ命名

```
feature/機能名       # 新機能
fix/バグ概要         # バグ修正
refactor/対象        # リファクタリング
chore/内容           # 設定・依存関係の更新
```

### 7-2. コミットメッセージ

```
fix：バグ修正
hotfix：クリティカルなバグ修正
add：新規（ファイル）機能追加
update：機能修正（バグではない）
change：仕様変更
clean：整理（リファクタリング等）
disable：無効化（コメントアウト等）
remove：削除（ファイル）
upgrade：バージョンアップ
revert：変更取り消し

```

- 1コミット1変更（複数の変更を1コミットにまとめない）
- コミット前に `./vendor/bin/pint` を実行する

---

## 8. テスト

- Feature テストは `tests/Feature/` に、Unit テストは `tests/Unit/` に配置する
- テストクラス名：`〇〇Test`（例：`CarControllerTest`）
- テストメソッド名：`test_〇〇` または `it_〇〇`（snake_case）
- 1テストメソッドで1つの事象のみテストする

```php
// ✅ 良い例
public function test_車一覧が正常に取得できること(): void
{
    $response = $this->get('/api/cars');
    $response->assertStatus(200);
}
```

---

## 9. セキュリティ

- ユーザー入力は必ず `FormRequest` でバリデーションする
- Blade での変数出力は必ず `{{ }}` を使用（`{!! !!}` はサニタイズ済みの値のみ）
- `.env` ファイルをコミットしない（`.gitignore` で除外済みであることを確認）
- N+1問題を避けるため、リレーションは `with()` を使って Eager Loading する

```php
// ✅ 良い例
$cars = Car::with(['maker', 'parts'])->get();

// ❌ 悪い例（N+1）
$cars = Car::all();
foreach ($cars as $car) {
    echo $car->maker->name; // N+1発生
}
```

---

*最終更新：2026-08-07*
