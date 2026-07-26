<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $destaques = Carro::where('ativo', true)
            ->where('destaque', true)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        return Inertia::render('Welcome', ['destaques' => $destaques]);
    }
}
