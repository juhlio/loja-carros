<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use App\Models\CustoCarro;
use Carbon\Carbon;
use Inertia\Inertia;

class AnaliseController extends Controller
{
    private const SITUACOES = [
        'disponivel' => 'Disponível',
        'em_reparo'  => 'Em reparo',
        'reservado'  => 'Reservado',
        'vendido'    => 'Vendido',
    ];

    private const ORIGENS = [
        'compra_particular' => 'Compra de particular',
        'fornecedor'        => 'Fornecedor',
        'troca'             => 'Troca',
        'consignado'        => 'Consignado',
        'sem_origem'        => 'Não informado',
    ];

    public function index()
    {
        $hoje = now();

        $carros = Carro::with('custos')->where('teste', false)->get()->map(function (Carro $carro) use ($hoje) {
            $custos = (float) $carro->custos->sum('valor');
            $investido = (float) $carro->preco_compra + (float) $carro->custo_reforma + $custos;
            $temCompra = $carro->preco_compra !== null;

            return [
                'id'              => $carro->id,
                'nome'            => trim("{$carro->marca} {$carro->modelo} {$carro->ano}"),
                'situacao'        => $carro->situacao,
                'situacao_label'  => self::SITUACOES[$carro->situacao] ?? $carro->situacao,
                'origem'          => $carro->origem ?? 'sem_origem',
                'preco'           => (float) $carro->preco,
                'custos_total'    => $custos,
                'total_investido' => $investido,
                'margem'          => $temCompra ? (float) $carro->preco - $investido : null,
                'dias_em_estoque' => ($carro->data_entrada && $carro->situacao !== 'vendido')
                    ? (int) Carbon::parse($carro->data_entrada)->startOfDay()->diffInDays($hoje->copy()->startOfDay())
                    : null,
            ];
        });

        $emEstoque = $carros->where('situacao', '!=', 'vendido');
        $vendidos = $carros->where('situacao', 'vendido');
        $margensVendidos = $vendidos->whereNotNull('margem');
        $diasEstoque = $emEstoque->whereNotNull('dias_em_estoque');

        $kpis = [
            'total'            => $carros->count(),
            'em_estoque'       => $emEstoque->count(),
            'em_estoque_com_compra' => $emEstoque->filter(fn ($c) => $c['margem'] !== null)->count(),
            'vendidos'         => $vendidos->count(),
            'investido'        => round($emEstoque->sum('total_investido'), 2),
            'preco_estoque'    => round($emEstoque->sum('preco'), 2),
            'custos_total'     => round($carros->sum('custos_total'), 2),
            'lucro_vendidos'   => round($margensVendidos->sum('margem'), 2),
            'margem_media'     => $margensVendidos->count() ? round($margensVendidos->avg('margem'), 2) : null,
            'dias_medio'       => $diasEstoque->count() ? (int) round($diasEstoque->avg('dias_em_estoque')) : null,
        ];

        $porSituacao = collect(self::SITUACOES)->map(fn ($rotulo, $chave) => [
            'label'      => $rotulo,
            'quantidade' => $carros->where('situacao', $chave)->count(),
            'investido'  => round($carros->where('situacao', $chave)->sum('total_investido'), 2),
        ])->values();

        $porOrigem = collect(self::ORIGENS)->map(fn ($rotulo, $chave) => [
            'label'      => $rotulo,
            'quantidade' => $carros->where('origem', $chave)->count(),
        ])->filter(fn ($item) => $item['quantidade'] > 0)->values();

        $porCategoria = CustoCarro::selectRaw('categoria, SUM(valor) AS total, COUNT(*) AS quantidade')
            ->groupBy('categoria')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($linha) => [
                'label'      => CustoCarro::CATEGORIAS[$linha->categoria] ?? $linha->categoria,
                'value'      => round((float) $linha->total, 2),
                'detalhe'    => $linha->quantidade . ($linha->quantidade === 1 ? ' lançamento' : ' lançamentos'),
            ])
            ->values();

        // Últimos 12 meses, incluindo meses sem custo, para o gráfico não pular datas.
        $inicio = now()->subMonths(11)->startOfMonth();
        $porMesRaw = CustoCarro::selectRaw("DATE_FORMAT(data, '%Y-%m') AS mes, SUM(valor) AS total")
            ->where('data', '>=', $inicio->toDateString())
            ->groupBy('mes')
            ->pluck('total', 'mes');

        $porMes = collect(range(0, 11))->map(function (int $i) use ($inicio, $porMesRaw) {
            $mes = $inicio->copy()->addMonths($i);
            $chave = $mes->format('Y-m');

            return [
                'label' => $mes->translatedFormat('M/y'),
                'value' => round((float) ($porMesRaw[$chave] ?? 0), 2),
            ];
        })->values();

        $margemPorCarro = $carros
            ->whereNotNull('margem')
            ->sortByDesc('margem')
            ->map(fn ($c) => [
                'label'   => $c['nome'],
                'value'   => round($c['margem'], 2),
                'detalhe' => self::SITUACOES[$c['situacao']] ?? $c['situacao'],
            ])
            ->values();

        $tabela = $carros
            ->sortByDesc('total_investido')
            ->values();

        return Inertia::render('Admin/Analise/Index', [
            'kpis' => $kpis,
            'porSituacao' => $porSituacao,
            'porOrigem' => $porOrigem,
            'porCategoria' => $porCategoria,
            'porMes' => $porMes,
            'margemPorCarro' => $margemPorCarro,
            'tabela' => $tabela,
        ]);
    }
}
