<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

// Cliente da API FIPE (fipe.parallelum.com.br, v2). Não oficial.
// Respostas são guardadas em cache. Falhas não são guardadas, para tentar de novo depois.
class FipeClient
{
    private const BASE = 'https://fipe.parallelum.com.br/api/v2/cars';

    public function marcas(): ?array
    {
        return $this->cached('fipe.marcas', now()->addDays(30), fn () => $this->get('/brands'));
    }

    public function modelos(string $marca): ?array
    {
        return $this->cached("fipe.modelos.{$marca}", now()->addDays(30), fn () => $this->get("/brands/{$marca}/models"));
    }

    public function anos(string $marca, string $modelo): ?array
    {
        return $this->cached("fipe.anos.{$marca}.{$modelo}", now()->addDays(7), fn () => $this->get("/brands/{$marca}/models/{$modelo}/years"));
    }

    public function preco(string $marca, string $modelo, string $ano): ?array
    {
        return $this->cached("fipe.preco.{$marca}.{$modelo}.{$ano}", now()->addDays(7), fn () => $this->get("/brands/{$marca}/models/{$modelo}/years/{$ano}"));
    }

    private function cached(string $chave, $ttl, callable $buscar): ?array
    {
        if (($valor = Cache::get($chave)) !== null) {
            return $valor;
        }

        $valor = $buscar();

        if ($valor !== null) {
            Cache::put($chave, $valor, $ttl);
        }

        return $valor;
    }

    private function get(string $caminho): ?array
    {
        try {
            $resposta = Http::timeout(8)->acceptJson()->get(self::BASE . $caminho);

            return $resposta->successful() ? $resposta->json() : null;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
