<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Carro;
use App\Models\CustoCarro;
use App\Support\ImagePipeline;
use Carbon\Carbon;
use App\Support\IndexNow;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CarroController extends Controller
{
    private const TAXA_CUSTO_ESTOQUE = 0.008;

    public function index()
    {
        $podeFinanceiro = $this->podeFinanceiro();

        $carros = Carro::with('custos')->get()->map(function (Carro $carro) use ($podeFinanceiro) {
            $carro->makeVisible(Carro::CAMPOS_INTERNOS);

            if (!$podeFinanceiro) {
                $carro->makeHidden(Carro::CAMPOS_FINANCEIROS);
            }

            $dados = $carro->toArray();

            if ($podeFinanceiro) {
                $custosTotal = (float) $carro->custos->sum('valor');
                $investido = (float) $carro->preco_compra + (float) $carro->custo_reforma + $custosTotal;

                $dados['custos_total'] = $custosTotal;
                $dados['total_investido'] = $investido;
                // Margem usa o preço anunciado. Para carros vendidos, é uma estimativa.
                $dados['margem'] = $carro->preco_compra !== null ? (float) $carro->preco - $investido : null;
            }

            return $dados;
        });

        return Inertia::render('Admin/Carros/Index', [
            'carros' => $carros,
            'podeFinanceiro' => $podeFinanceiro,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Carros/Create', ['podeFinanceiro' => $this->podeFinanceiro()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'marca'        => 'required|string',
            'modelo'       => 'required|string',
            'ano'          => 'required|integer',
            'preco'        => 'required|numeric',
            'cor'          => 'required|string',
            'combustivel'  => 'required|string',
            'km'           => 'required|integer',
            'descricao'    => 'nullable|string',
            'placa'        => 'required|unique:carros',
            'imagens.*'    => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480',
            ...$this->regrasInternas(),
        ]);

        $imagens = [];
        if ($request->hasFile('imagens')) {
            foreach ($request->file('imagens') as $file) {
                $imagens[] = ImagePipeline::processUpload($file);
            }
        }
        $validated['imagens'] = $imagens;
        $validated['destaque'] = $request->boolean('destaque');
        $validated = $this->tratarInternos($validated, $request);

        $carro = Carro::create($validated);

        IndexNow::submit([url($carro->url), url('/catalogo'), url('/sitemap.xml')]);

        return redirect()->route('admin.carros.index')->with('message', 'Carro adicionado com sucesso!');
    }

    public function show(Carro $carro)
    {
        $podeFinanceiro = $this->podeFinanceiro();

        $carro->makeVisible(Carro::CAMPOS_INTERNOS);

        if (!$podeFinanceiro) {
            $carro->makeHidden(Carro::CAMPOS_FINANCEIROS);
        }

        return Inertia::render('Admin/Carros/Show', [
            'carro' => $carro,
            'podeFinanceiro' => $podeFinanceiro,
            'custos' => $podeFinanceiro ? $carro->custos()->orderByDesc('data')->get() : [],
            'categoriasCustos' => CustoCarro::CATEGORIAS,
            'analise' => $podeFinanceiro ? $this->analiseDoCarro($carro) : null,
        ]);
    }

    public function edit(Carro $carro)
    {
        $carro->makeVisible(Carro::CAMPOS_INTERNOS);

        if (!$this->podeFinanceiro()) {
            $carro->makeHidden(Carro::CAMPOS_FINANCEIROS);
        }

        $podeFinanceiro = $this->podeFinanceiro();

        return Inertia::render('Admin/Carros/Edit', [
            'carro' => $carro,
            'podeFinanceiro' => $podeFinanceiro,
            'custos' => $podeFinanceiro ? $carro->custos()->orderByDesc('data')->get() : [],
            'categoriasCustos' => $podeFinanceiro ? CustoCarro::CATEGORIAS : [],
        ]);
    }

    public function update(Request $request, Carro $carro)
    {
        $validated = $request->validate([
            'marca'        => 'required|string',
            'modelo'       => 'required|string',
            'ano'          => 'required|integer',
            'preco'        => 'required|numeric',
            'cor'          => 'required|string',
            'combustivel'  => 'required|string',
            'km'           => 'required|integer',
            'descricao'    => 'nullable|string',
            'placa'        => 'required|unique:carros,placa,' . $carro->id,
            'imagens.*'    => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480',
            ...$this->regrasInternas(),
        ]);

        $imagens = $carro->imagens ?? [];

        if ($request->hasFile('imagens')) {
            foreach ($imagens as $imagem) {
                ImagePipeline::delete($imagem);
            }
            $imagens = [];
            foreach ($request->file('imagens') as $file) {
                $imagens[] = ImagePipeline::processUpload($file);
            }
        }
        $validated['imagens'] = $imagens;
        $validated['ativo'] = $request->boolean('ativo');
        $validated['destaque'] = $request->boolean('destaque');
        $validated = $this->tratarInternos($validated, $request);

        $carro->update($validated);

        IndexNow::submit([url($carro->url), url('/catalogo')]);

        return redirect()->route('admin.carros.index')->with('message', 'Carro atualizado com sucesso!');
    }

    // Troca rápida de situação, sem abrir o formulário completo.
    public function situacao(Request $request, Carro $carro)
    {
        $validated = $request->validate([
            'situacao' => 'required|in:disponivel,em_reparo,reservado,vendido',
        ]);

        $carro->update($validated);

        return back()->with('message', 'Situação atualizada.');
    }

    private function analiseDoCarro(Carro $carro): array
    {
        $custos = $carro->custos;
        $custosTotal = (float) $custos->sum('valor');
        $compra = $carro->preco_compra !== null ? (float) $carro->preco_compra : null;
        $reforma = (float) $carro->custo_reforma;
        $investido = (float) $compra + $reforma + $custosTotal;
        $precoAnunciado = (float) $carro->preco;
        $margem = $compra !== null ? $precoAnunciado - $investido : null;

        // Tempo em estoque: até a venda, se o carro já foi vendido. Até hoje, se ainda está à venda.
        $dias = null;
        if ($carro->data_entrada) {
            $fim = $carro->situacao === 'vendido' && $carro->data_venda
                ? Carbon::parse($carro->data_venda)
                : now();
            $dias = (int) Carbon::parse($carro->data_entrada)->startOfDay()->diffInDays($fim->copy()->startOfDay());
        }

        $custo = $this->custoDeEstoque($carro);

        $composicao = collect([
            ['label' => 'Preço de compra', 'value' => round((float) $compra, 2)],
            ['label' => 'Custo de reforma', 'value' => round($reforma, 2)],
        ])->merge(
            $custos->groupBy('categoria')->map(fn ($grupo, $categoria) => [
                'label' => CustoCarro::CATEGORIAS[$categoria] ?? $categoria,
                'value' => round((float) $grupo->sum('valor'), 2),
            ])->values()
        )->filter(fn ($item) => $item['value'] > 0)->values();

        $porMes = $custos
            ->groupBy(fn ($c) => Carbon::parse($c->data)->format('Y-m'))
            ->sortKeys()
            ->map(fn ($grupo, $mes) => [
                'label' => Carbon::createFromFormat('Y-m', $mes)->translatedFormat('M/y'),
                'value' => round((float) $grupo->sum('valor'), 2),
            ])
            ->values();

        return [
            'kpis' => [
                'investido'        => round($investido, 2),
                'compra'           => $compra,
                'reforma'          => round($reforma, 2),
                'custos_total'     => round($custosTotal, 2),
                'qtd_custos'       => $custos->count(),
                'preco_anunciado'  => round($precoAnunciado, 2),
                'margem'           => $margem === null ? null : round($margem, 2),
                'margem_percentual'=> ($margem !== null && $investido > 0) ? round($margem / $investido * 100, 1) : null,
                'dias_em_estoque'  => $dias,
                // Custo de estoque não entra na margem acima. Aparece separado, em margem_liquida.
                'custo_mensal'     => $custo['mensal'],
                'custo_diario'     => $custo['diario'],
                'custo_estoque'    => $custo['total'],
                'margem_liquida'   => ($margem !== null && $custo['total'] !== null) ? round($margem - $custo['total'], 2) : null,
            ],
            'composicao' => $composicao,
            'porMes' => $porMes,
        ];
    }

    // Custo de estoque: 0,8% do valor FIPE por mês, dividido pelos dias de cada mês em que o carro ficou parado.
    private function custoDeEstoque(Carro $carro): array
    {
        $vazio = ['mensal' => null, 'diario' => null, 'total' => null];

        if ($carro->fipe_valor === null || !$carro->data_entrada) {
            return $vazio;
        }

        $inicio = Carbon::parse($carro->data_entrada)->startOfDay();
        $fim = ($carro->situacao === 'vendido' && $carro->data_venda)
            ? Carbon::parse($carro->data_venda)->startOfDay()
            : now()->startOfDay();

        $mensal = (float) $carro->fipe_valor * self::TAXA_CUSTO_ESTOQUE;
        $total = 0.0;

        for ($dia = $inicio->copy(); $dia->lt($fim); $dia->addDay()) {
            $total += $mensal / $dia->daysInMonth;
        }

        return [
            'mensal' => round($mensal, 2),
            'diario' => round($mensal / now()->daysInMonth, 2),
            'total' => round($total, 2),
        ];
    }

    private function podeFinanceiro(): bool
    {
        $admin = Admin::find(session('admin_id'));

        return $admin?->isAdmin() ?? false;
    }

    private function regrasInternas(): array
    {
        return [
            'preco_compra'      => 'nullable|numeric|min:0',
            'custo_reforma'     => 'nullable|numeric|min:0',
            'preco_minimo'      => 'nullable|numeric|min:0',
            'renavam'           => 'nullable|string|max:20',
            'chassi'            => 'nullable|string|max:30',
            'ipva_situacao'     => 'nullable|in:pago,pendente,isento',
            'licenciamento_ano' => 'nullable|integer|min:1900|max:2100',
            'origem'            => 'nullable|in:compra_particular,fornecedor,troca,consignado',
            'fornecedor'        => 'nullable|string|max:255',
            'data_entrada'      => 'nullable|date',
            'situacao'          => 'required|in:disponivel,em_reparo,reservado,vendido',
            'data_venda'        => 'nullable|date',
            'comprador'         => 'nullable|string|max:255',
            'local_estoque'     => 'nullable|string|max:255',
            'observacoes'       => 'nullable|string',
            'fipe_codigo'       => 'nullable|string|max:20',
            'fipe_valor'        => 'nullable|numeric|min:0',
            'fipe_referencia'   => 'nullable|string|max:50',
            'fipe_consultado_em'=> 'nullable|date',
        ];
    }

    private function tratarInternos(array $validated, Request $request): array
    {
        $validated['multas'] = $request->boolean('multas');
        $validated['gravame'] = $request->boolean('gravame');
        $validated['teste'] = $request->boolean('teste');

        // Quem não é admin não grava valores financeiros. Na edição, o valor atual permanece.
        if (!$this->podeFinanceiro()) {
            foreach (Carro::CAMPOS_FINANCEIROS as $campo) {
                unset($validated[$campo]);
            }
        }

        return $validated;
    }

    public function destroy(Carro $carro)
    {
        $url = url($carro->url);

        if ($carro->imagens) {
            foreach ($carro->imagens as $imagem) {
                ImagePipeline::delete($imagem);
            }
        }
        $carro->delete();

        IndexNow::submit([$url, url('/catalogo'), url('/sitemap.xml')]);

        return redirect()->route('admin.carros.index')->with('message', 'Carro deletado com sucesso!');
    }
}
