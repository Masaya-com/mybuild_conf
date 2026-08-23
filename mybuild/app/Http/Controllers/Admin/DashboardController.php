<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Maker;
use App\Models\Part;
use App\Models\User;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $summary = [
            'cars'   => Car::count(),
            'makers' => Maker::count(),
            'parts'  => Part::count(),
            'users'  => User::count(),
        ];

        $recentCars = Car::with('maker')
            ->latest()
            ->take(5)
            ->get();

        return view('admin.dashboard.index', compact('summary', 'recentCars'));
    }
}
