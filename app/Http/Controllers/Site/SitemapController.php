<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = rtrim(config('app.url'), '/');
        $carros = Carro::where('ativo', true)->orderBy('updated_at', 'desc')
            ->get(['id', 'marca', 'modelo', 'ano', 'updated_at', 'imagens']);

        // Home e catálogo variam sempre que o estoque muda, então usam o
        // lastmod do carro mais recentemente atualizado como aproximação.
        $lastmodGeral = $carros->max('updated_at')?->toAtomString();

        $urls = [
            [
                'loc' => $baseUrl . '/',
                'lastmod' => $lastmodGeral,
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
            [
                'loc' => $baseUrl . '/catalogo',
                'lastmod' => $lastmodGeral,
                'changefreq' => 'daily',
                'priority' => '0.9',
            ],
        ];

        $carros->each(function (Carro $carro) use (&$urls, $baseUrl) {
            $urls[] = [
                'loc' => $baseUrl . $carro->url,
                'lastmod' => $carro->updated_at?->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
                'images' => collect($carro->imagens ?? [])->map(fn ($caminho) => [
                    'loc' => asset("storage/{$caminho}"),
                    'title' => trim("{$carro->marca} {$carro->modelo} {$carro->ano}"),
                ])->all(),
            ];
        });

        $xml = '<' . '?xml version="1.0" encoding="UTF-8"?' . '>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . htmlspecialchars($url['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
            if (!empty($url['lastmod'])) {
                $xml .= '    <lastmod>' . $url['lastmod'] . "</lastmod>\n";
            }
            $xml .= '    <changefreq>' . $url['changefreq'] . "</changefreq>\n";
            $xml .= '    <priority>' . $url['priority'] . "</priority>\n";
            foreach ($url['images'] ?? [] as $image) {
                $xml .= "    <image:image>\n";
                $xml .= '      <image:loc>' . htmlspecialchars($image['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</image:loc>\n";
                if (!empty($image['title'])) {
                    $xml .= '      <image:title>' . htmlspecialchars($image['title'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</image:title>\n";
                }
                $xml .= "    </image:image>\n";
            }
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
