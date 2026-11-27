<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\FipeClient;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FipeController extends Controller
{
    // Palavras de combustível do nosso cadastro e como a FIPE escreve.
    private const COMBUSTIVEIS = [
        'gasolina'  => ['GASOLINA', 'FLEX'],
        'diesel'    => ['DIESEL'],
        'eletrico'  => ['ELETRICO'],
        'hibrido'   => ['HIBRIDO'],
    ];

    public function buscar(Request $request, FipeClient $fipe)
    {
        $dados = $request->validate([
            'marca'       => 'required|string|max:100',
            'modelo'      => 'required|string|max:100',
            'ano'         => 'required|integer|min:1900|max:2100',
            'combustivel' => 'nullable|string|max:20',
        ]);

        $marcas = $fipe->marcas();
        if ($marcas === null) {
            return response()->json(['erro' => 'A tabela FIPE não respondeu. Tente novamente em instantes.'], 503);
        }

        $marca = $this->encontrarMarca($marcas, $dados['marca']);
        if (!$marca) {
            return response()->json(['erro' => "Marca \"{$dados['marca']}\" não encontrada na FIPE."], 404);
        }

        $modelos = $fipe->modelos($marca['code']);
        if ($modelos === null) {
            return response()->json(['erro' => 'A tabela FIPE não respondeu. Tente novamente em instantes.'], 503);
        }

        $candidatos = [];
        foreach ($this->modelosParecidos($modelos, $dados['modelo']) as $modelo) {
            $anos = $fipe->anos($marca['code'], $modelo['code']) ?? [];
            $ano = $this->anoCorrespondente($anos, $dados['ano'], $dados['combustivel'] ?? null);
            if (!$ano) {
                continue;
            }

            $preco = $fipe->preco($marca['code'], $modelo['code'], $ano['code']);
            if (!$preco) {
                continue;
            }

            $candidatos[] = [
                'nome'        => $preco['model'],
                'ano'         => $preco['modelYear'],
                'combustivel' => $preco['fuel'],
                'codigo_fipe' => $preco['codeFipe'],
                'valor'       => $this->valorParaNumero($preco['price']),
                'referencia'  => $preco['referenceMonth'],
            ];
        }

        return response()->json(['candidatos' => $candidatos]);
    }

    private function encontrarMarca(array $marcas, string $nome): ?array
    {
        $alvo = $this->semEspacos($nome);

        foreach ($marcas as $marca) {
            if ($alvo !== '' && str_contains($this->semEspacos($marca['name']), $alvo)) {
                return $marca;
            }
        }

        return null;
    }

    // Os modelos da FIPE são descrições de versão longas. Por isso comparamos por palavras.
    private function modelosParecidos(array $modelos, string $nome): array
    {
        $palavras = array_values(array_filter(explode(' ', $this->normalizar($nome))));
        if (!$palavras) {
            return [];
        }

        $minimo = (int) ceil(count($palavras) * 0.6);

        return collect($modelos)
            ->map(function (array $modelo) use ($palavras) {
                $presentes = explode(' ', $this->normalizar($modelo['name']));
                $modelo['score'] = count(array_intersect($palavras, $presentes));

                return $modelo;
            })
            ->filter(fn ($m) => $m['score'] >= max($minimo, 1))
            ->sortBy([['score', 'desc'], ['name', 'asc']])
            ->take(6)
            ->values()
            ->all();
    }

    private function anoCorrespondente(array $anos, int $ano, ?string $combustivel): ?array
    {
        $doAno = array_values(array_filter($anos, fn ($a) => str_starts_with($a['name'], (string) $ano)));
        if (!$doAno) {
            return null;
        }

        $palavrasCombustivel = self::COMBUSTIVEIS[$combustivel] ?? null;
        if ($palavrasCombustivel) {
            foreach ($doAno as $a) {
                $nome = $this->normalizar($a['name']);
                foreach ($palavrasCombustivel as $palavra) {
                    if (str_contains($nome, $palavra)) {
                        return $a;
                    }
                }
            }
        }

        // Se o combustível foi informado, não aceitamos uma versão de outro combustível.
        return $palavrasCombustivel ? null : $doAno[0];
    }

    private function normalizar(string $texto): string
    {
        return trim(preg_replace('/[^A-Z0-9 ]/', ' ', strtoupper(Str::ascii($texto))));
    }

    private function semEspacos(string $texto): string
    {
        return str_replace(' ', '', $this->normalizar($texto));
    }

    private function valorParaNumero(string $preco): float
    {
        // "R$ 75.551,00" -> 75551.00
        $numero = preg_replace('/[^\d,]/', '', $preco);

        return (float) str_replace(',', '.', $numero);
    }
}
