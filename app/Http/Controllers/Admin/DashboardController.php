<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Carro;
use App\Models\CustoCarro;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private const SITUACOES = [
        'disponivel' => 'Disponível',
        'em_reparo'  => 'Em reparo',
        'reservado'  => 'Reservado',
        'vendido'    => 'Vendido',
    ];

    public function index()
    {
        $admin = Admin::find(session('admin_id'));
        $podeFinanceiro = $admin?->isAdmin() ?? false;

        $carros = Carro::with('custos')->where('teste', false)->get();
        $emEstoque = $carros->where('situacao', '!=', 'vendido');
        $hoje = now();

        $estoque = [
            'total'      => $carros->count(),
            'ativos'     => $carros->where('ativo', true)->count(),
            'em_estoque' => $emEstoque->count(),
            'vendidos'   => $carros->where('situacao', 'vendido')->count(),
            'em_reparo'  => $carros->where('situacao', 'em_reparo')->count(),
            'reservados' => $carros->where('situacao', 'reservado')->count(),
            'ocultos'    => $carros->where('ativo', false)->count(),
        ];

        $porSituacao = collect(self::SITUACOES)->map(fn ($rotulo, $chave) => [
            'label' => $rotulo,
            'value' => $carros->where('situacao', $chave)->count(),
        ])->values();

        $recentes = Carro::orderByDesc('created_at')->limit(5)->get()->map(fn (Carro $c) => [
            'nome'    => trim("{$c->marca} {$c->modelo} {$c->ano}"),
            'detalhe' => self::SITUACOES[$c->situacao] ?? $c->situacao,
            'url'     => "/admin/carros/{$c->id}",
        ])->values();

        $alertas = [
            [
                'titulo'     => 'Sem fotos',
                'quantidade' => $emEstoque->filter(fn ($c) => empty($c->imagens))->count(),
                'itens'      => $this->itens($emEstoque->filter(fn ($c) => empty($c->imagens))),
            ],
            [
                'titulo'     => 'Parados há mais de 90 dias',
                'quantidade' => $emEstoque->filter(fn ($c) => $this->diasEmEstoque($c, $hoje) > 90)->count(),
                'itens'      => $this->itens(
                    $emEstoque->filter(fn ($c) => $this->diasEmEstoque($c, $hoje) > 90),
                    fn ($c) => $this->diasEmEstoque($c, $hoje) . ' dias'
                ),
            ],
        ];

        $financeiro = null;

        if ($podeFinanceiro) {
            $investidoPor = fn ($c) => (float) $c->preco_compra + (float) $c->custo_reforma + (float) $c->custos->sum('valor');
            $margens = $carros
                ->where('situacao', 'vendido')
                ->whereNotNull('preco_compra')
                ->map(fn ($c) => (float) $c->preco - $investidoPor($c));

            $alertas[] = [
                'titulo'     => 'Sem preço de compra',
                'quantidade' => $emEstoque->whereNull('preco_compra')->count(),
                'itens'      => $this->itens($emEstoque->whereNull('preco_compra')),
            ];

            $financeiro = [
                'investido'     => round($emEstoque->sum(fn ($c) => $investidoPor($c)), 2),
                'preco_estoque' => round($emEstoque->sum('preco'), 2),
                'custos_mes'    => round((float) CustoCarro::whereBetween('data', [$hoje->copy()->startOfMonth()->toDateString(), $hoje->copy()->endOfMonth()->toDateString()])->sum('valor'), 2),
                'custos_total'  => round((float) CustoCarro::sum('valor'), 2),
                'margem_media'  => $margens->count() ? round($margens->avg(), 2) : null,
            ];
        }

        return Inertia::render('Admin/Dashboard/Index', [
            'podeFinanceiro' => $podeFinanceiro,
            'estoque' => $estoque,
            'porSituacao' => $porSituacao,
            'financeiro' => $financeiro,
            'alertas' => $alertas,
            'recentes' => $recentes,
        ]);
    }

    private function diasEmEstoque(Carro $carro, Carbon $hoje): int
    {
        if (!$carro->data_entrada) {
            return 0;
        }

        return (int) Carbon::parse($carro->data_entrada)->startOfDay()->diffInDays($hoje->copy()->startOfDay());
    }

    private function itens($colecao, ?callable $detalhe = null): array
    {
        return $colecao->take(5)->map(fn (Carro $c) => [
            'nome'    => trim("{$c->marca} {$c->modelo} {$c->ano}"),
            'detalhe' => $detalhe ? $detalhe($c) : null,
            'url'     => "/admin/carros/{$c->id}",
        ])->values()->all();
    }
}
