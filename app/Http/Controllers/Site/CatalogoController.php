<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use App\Models\Setting;
use App\Support\TextFormat;
use Inertia\Inertia;

class CatalogoController extends Controller
{
    public function index()
    {
        $carros = Carro::where("ativo", true)->orderBy("created_at", "desc")->get();
        $nomeLoja = Setting::get('nome_loja', 'Loja de Carros');

        return Inertia::render("Site/Catalogo", [
            "carros" => $carros,
            "seo" => [
                "title" => "Catálogo de Seminovos — {$nomeLoja} | Chapecó, SC",
                "description" => "Confira nosso estoque de seminovos em Chapecó, SC. Estoque atualizado, procedência garantida e financiamento facilitado. Fale conosco no WhatsApp.",
                "type" => "website",
            ],
        ]);
    }

    public function show($id)
    {
        $carro = Carro::where("ativo", true)->findOrFail((int) $id);

        if ($id !== "{$carro->id}-{$carro->slug}") {
            return redirect($carro->url, 301);
        }

        $marca  = TextFormat::tituloVeiculo($carro->marca);
        $modelo = TextFormat::tituloVeiculo($carro->modelo);
        $cor    = TextFormat::tituloVeiculo($carro->cor);
        $nomeCompleto = trim("{$marca} {$modelo} {$carro->ano}");
        $nomeLoja = Setting::get('nome_loja', 'Loja de Carros');
        $imagem = $carro->imagens[0] ?? null;
        $imagemUrl = $imagem ? asset("storage/{$imagem}") : null;
        $km = number_format((float) $carro->km, 0, ',', '.');

        return Inertia::render("Site/DetalheCarro", [
            "carro" => $carro,
            "seo" => [
                "title" => "{$nomeCompleto} — {$nomeLoja} | Chapecó, SC",
                "description" => "{$nomeCompleto}, {$km} km, " . ucfirst((string) $carro->combustivel) . ". Confira preço, fotos e agende um test drive na {$nomeLoja}, em Chapecó, SC.",
                "image" => $imagemUrl,
                "type" => "product",
                "jsonLd" => array_filter([
                    "@context" => "https://schema.org",
                    "@type" => "Car",
                    "name" => $nomeCompleto,
                    "brand" => ["@type" => "Brand", "name" => $marca],
                    "model" => $modelo,
                    "vehicleModelDate" => (string) $carro->ano,
                    "mileageFromOdometer" => [
                        "@type" => "QuantitativeValue",
                        "value" => (int) $carro->km,
                        "unitCode" => "KMT",
                    ],
                    "color" => $cor,
                    "fuelType" => $carro->combustivel,
                    "image" => $imagemUrl,
                    "offers" => [
                        "@type" => "Offer",
                        "priceCurrency" => "BRL",
                        "price" => (string) $carro->preco,
                        "availability" => "https://schema.org/InStock",
                        "url" => url($carro->url),
                    ],
                ]),
            ],
        ]);
    }
}
