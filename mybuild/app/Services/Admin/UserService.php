<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    private const PER_PAGE = 20;

    /**
     * 検索条件を適用してユーザー一覧を取得する。
     *
     * @param array{search?: string} $filters
     */
    public function getPaginatedUsers(array $filters): LengthAwarePaginator
    {
        $query = User::withCount('favorites')
            ->orderBy('created_at', 'desc');

        if (! empty($filters['search'])) {
            $keyword = $filters['search'];
            $query->where(function ($q) use ($keyword): void {
                $q->where('name', 'ilike', "%{$keyword}%")
                  ->orWhere('email', 'ilike', "%{$keyword}%");
            });
        }

        return $query->paginate(self::PER_PAGE)->withQueryString();
    }
}
