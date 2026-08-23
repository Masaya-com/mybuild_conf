<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\Auth\AdminLoginController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// ─── 認証ルート（ゲストのみ） ───────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
});

// ─── ログアウト（認証済みのみ） ──────────────────────────
Route::post('/logout', [LoginController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// ─── 業務ルート（後続ステップで追加） ────────────────────
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

// ─── 管理者ルート ─────────────────────────────────────────
Route::prefix('admin')->name('admin.')->group(function () {

    // 管理者ゲストのみ
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'showForm'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'login']);
    });

    // 管理者ログアウト
    Route::post('/logout', [AdminLoginController::class, 'logout'])
        ->middleware('admin.auth:admin')
        ->name('logout');

    // 管理者認証済みのみ
    Route::middleware('admin.auth:admin')->group(function () {
        //         Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        // Route::get('/users', [UserController::class, 'index'])->name('users.index');
        // 以下は順次追加
        // Route::resource('cars', Admin\CarController::class);
        // Route::resource('makers', Admin\MakerController::class);
        // Route::resource('parts', Admin\PartController::class);
    });
    // 以下は開発時にログインが面倒なのでいったんmiddlewareから外す
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
});

// 以下のルートは実装時に順次追加する
// Route::get('/ranking', ...)->name('ranking.index');
// Route::get('/cars', ...)->name('cars.index');
// Route::get('/cars/{car}', ...)->name('cars.show');
// Route::get('/compare', ...)->name('compare.show');
// Route::middleware('auth')->group(function () {
//     Route::get('/favorites', ...)->name('favorites.index');
//     Route::post('/favorites/{car}', ...)->name('favorites.toggle');
// });
