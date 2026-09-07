<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use App\Models\Setting;
use Illuminate\Http\Response;

class LlmsController extends Controller
{
    public function index(): Response
    {
        $nomeLoja = Setting::get('nome_loja', 'Loja de Carros');
        $telefone = Setting::get('telefone', '') ?: Setting::get('whatsapp', '');
        $endereco = Setting::get('endereco', '');
        $totalCarros = Carro::where('ativo', true)->count();

        $linhas = [
            "# {$nomeLoja}",
            '',
            "> Loja de veículos seminovos e usados em Chapecó, Santa Catarina, Brasil. Estoque de {$totalCarros} veículos ativos, atualizado continuamente. Procedência garantida, financiamento facilitado e negociação direta pelo WhatsApp.",
            '',
            '## Páginas',
            '',
            '- [Estoque completo](' . url('/catalogo') . '): catálogo com todos os veículos disponíveis, com marca, modelo, ano, quilometragem, combustível e preço.',
            '- [Sitemap XML](' . url('/sitemap.xml') . '): lista de todas as URLs do site, incluindo cada veículo individual.',
        ];

        if ($endereco) {
            $linhas[] = "- Endereço: {$endereco}.";
        }
        if ($telefone) {
            $linhas[] = "- Contato: {$telefone}.";
        }

        $linhas[] = '';
        $linhas[] = '## Observações';
        $linhas[] = '';
        $linhas[] = 'Cada página de veículo (`/carro/{id}-{slug}`) contém marca, modelo, ano, preço, quilometragem, combustível, cor e fotos. Os dados estruturados (JSON-LD) em cada página seguem o vocabulário schema.org (`AutoDealer`, `Car`, `Offer`, `BreadcrumbList`).';

        return response(implode("\n", $linhas), 200)->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
