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
            ->take(4)
            ->get();

        // Completa com carros ativos recentes até formar uma fileira cheia de 3,
        // sem cortar destaques marcados explicitamente pelo admin.
        if ($destaques->count() < 3) {
            $extras = Carro::where('ativo', true)
                ->whereNotIn('id', $destaques->pluck('id'))
                ->orderBy('created_at', 'desc')
                ->take(3 - $destaques->count())
                ->get();

            $destaques = $destaques->concat($extras);
        }

        return Inertia::render('Welcome', ['destaques' => $destaques]);
    }
}
