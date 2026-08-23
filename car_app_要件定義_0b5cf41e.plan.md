---
name: Car App 要件定義
overview: Laravel + Vue.js + PostgreSQL を使った車性能比較アプリの要件定義・画面構成・DB設計。メーカーを跨いだ2台比較・パーツ交換シミュレーション・ランキング・お気に入りが主要機能。
todos:
  - id: migration
    content: DB マイグレーション作成（makers / cars / parts / car_parts / user_favorites）
    status: completed
  - id: seeder
    content: CSV から DB にデータを投入するシーダー作成
    status: completed
  - id: auth
    content: Laravel Breeze + Inertia.js + Vue セットアップ（認証含む）
    status: in_progress
  - id: car_api
    content: 車一覧・詳細・検索フィルター API 実装
    status: pending
  - id: car_ui
    content: 車一覧・詳細画面（Vue コンポーネント）実装
    status: pending
  - id: compare
    content: 2台比較機能（フローティングバー → 比較ページ）実装
    status: pending
  - id: parts_sim
    content: パーツ交換シミュレーション機能実装
    status: pending
  - id: ranking
    content: ランキングページ実装
    status: pending
  - id: favorites
    content: お気に入り機能実装
    status: pending
isProject: false
---

# 車性能比較アプリ 要件定義

## 技術スタック

- Backend: Laravel (PHP)
- Frontend: Vue.js (Inertia.js でサーバーサイドルーティングと統合)
- DB: PostgreSQL 16
- インフラ: Docker (既存の docker-compose.yml)

Inertia.js を使うことで、Laravel Blade のルーティング管理を保ちつつ Vue.js でリッチなUI を構築できる（フルSPAより簡易）。

---

## 機能要件

- ユーザー認証（登録・ログイン・ログアウト）
- 車一覧・検索・フィルター（メーカー / 年式 / 駆動方式 / 価格帯 / 燃料種別）
- 車詳細スペック表示
- 2台同時比較（メーカー跨ぎ可）
- パーツ交換シミュレーション（パーツ変更 → 性能数値がリアルタイム更新）
- パーツ変更後の車同士も比較可能
- 性能項目別ランキング（最高速 / 加速 / ハンドリング など）
- お気に入り登録（要ログイン）

---

## 画面構成

```mermaid
flowchart TD
    Home["ホーム (/)"]
    CarList["車一覧 (/cars)"]
    CarDetail["車詳細 (/cars/{id})"]
    Compare["比較ページ (/compare)"]
    Ranking["ランキング (/ranking)"]
    Favorites["お気に入り (/favorites)"]
    Login["ログイン (/login)"]
    Register["新規登録 (/register)"]

    Home -->|"検索・フィルター"| CarList
    Home --> Ranking
    Home --> Favorites
    CarList --> CarDetail
    CarDetail -->|"比較に追加 (最大2台)"| Compare
    CarDetail -->|"パーツ変更シミュ"| Compare
    Favorites --> CarDetail
    Login --> Home
    Register --> Home
```

### 各画面の主要コンテンツ

- **ホーム**: 検索バー・フィルター・ランキングプレビュー（TOP5）・最近追加された車
- **車一覧**: カード形式グリッド・絞り込みサイドバー・「比較に追加」ボタン
- **車詳細**: 全スペック表・パーツカテゴリ別プルダウン（変更するとリアルタイムで数値更新）・レーダーチャート・「比較に追加」ボタン
- **比較ページ**: 2台をサイドバイサイドで並べた表・レーダーチャート重ね合わせ・優劣をハイライト
- **ランキング**: 項目タブ切り替え（最高速 / 0-100加速 / ハンドリング / トルク / 燃費）・上位10台
- **お気に入り**: 登録した車のカード一覧

---

## DB設計

```mermaid
erDiagram
    users {
        bigint id PK
        string name
        string email
        string password
        timestamp created_at
        timestamp updated_at
    }
    makers {
        bigint id PK
        string name
        string name_en
        string country
    }
    cars {
        bigint id PK
        bigint maker_id FK
        string model
        int year
        string grade
        string body_type
        string engine_name
        string engine_type
        int displacement_cc
        int max_power_ps
        int max_power_rpm
        int max_torque_nm
        int max_torque_rpm
        int top_speed_kmh
        decimal acceleration_0_100_sec
        string fuel_type
        decimal fuel_efficiency_km_per_l
        string drive_type
        string transmission
        int weight_kg
        int wheelbase_mm
        string suspension_front
        string suspension_rear
        string brake_front
        string brake_rear
        string tire_size_front
        string tire_size_rear
        decimal handling_score
        int braking_distance_100_0_m
        int price_man_yen
        int seating_capacity
    }
    parts {
        bigint id PK
        string part_category
        string part_name
        string part_maker
        string grade
        int price_yen
        int power_delta_ps
        int torque_delta_nm
        decimal acceleration_delta_sec
        int top_speed_delta_kmh
        decimal fuel_efficiency_delta
        int weight_delta_kg
        decimal handling_score_delta
        int braking_distance_delta_m
        string description
    }
    car_parts {
        bigint id PK
        bigint car_id FK
        bigint part_id FK
    }
    user_favorites {
        bigint id PK
        bigint user_id FK
        bigint car_id FK
        timestamp created_at
    }

    makers ||--o{ cars : "has"
    cars ||--o{ car_parts : "has"
    parts ||--o{ car_parts : "compatible"
    users ||--o{ user_favorites : "saves"
    cars ||--o{ user_favorites : "saved_by"
```

### テーブル補足

- `car_parts`: CSVの `compatible_models` を正規化した中間テーブル（多対多）
- パーツシミュレーションのロジック: `cars` の基本値 + 選択した `parts` の delta値 をフロントで計算
- 保存済みビルド機能（カスタム構成の保存）はフェーズ2として将来拡張可

---

## 実装フェーズ（推奨順）

1. DB マイグレーション・シーダー（CSV からインポート）
2. Laravel 認証（Laravel Breeze + Inertia + Vue）
3. 車一覧・詳細 API + 画面
4. 比較機能
5. パーツシミュレーション
6. ランキング・お気に入り
