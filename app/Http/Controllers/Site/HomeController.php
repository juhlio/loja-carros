<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use App\Models\Setting;
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

        $nomeLoja = Setting::get('nome_loja', 'Loja de Carros');
        $logo     = Setting::get('logo');
        $telefone = Setting::get('telefone', '') ?: Setting::get('whatsapp', '');
        $endereco = Setting::get('endereco', '');

        return Inertia::render('Welcome', [
            'destaques' => $destaques,
            'seo' => [
                'title' => "{$nomeLoja} — Seminovos em Chapecó, SC",
                'description' => "Compre seu carro seminovo em Chapecó, SC com procedência garantida. Estoque selecionado, financiamento facilitado e atendimento direto pelo WhatsApp.",
                'image' => $logo ? asset("storage/{$logo}") : null,
                'type' => 'website',
                'jsonLd' => array_filter([
                    '@context' => 'https://schema.org',
                    '@type' => 'AutoDealer',
                    'name' => $nomeLoja,
                    'image' => $logo ? asset("storage/{$logo}") : null,
                    'url' => url('/'),
                    'telephone' => $telefone ?: null,
                    'address' => $endereco ? [
                        '@type' => 'PostalAddress',
                        'streetAddress' => $endereco,
                        'addressLocality' => 'Chapecó',
                        'addressRegion' => 'SC',
                        'addressCountry' => 'BR',
                    ] : null,
                ]),
            ],
        ]);
    }
}
