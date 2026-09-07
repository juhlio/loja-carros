<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = [
            ['loc' => url('/'), 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => url('/catalogo'), 'changefreq' => 'daily', 'priority' => '0.9'],
        ];

        Carro::where('ativo', true)->orderBy('updated_at', 'desc')->get(['id', 'marca', 'modelo', 'ano', 'updated_at'])
            ->each(function (Carro $carro) use (&$urls) {
                $urls[] = [
                    'loc' => url($carro->url),
                    'lastmod' => $carro->updated_at?->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                ];
            });

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
