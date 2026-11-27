<?php

namespace App\Models;

use App\Support\TextFormat;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Carro extends Model
{
    protected $fillable = [
        'marca',
        'modelo',
        'ano',
        'preco',
        'cor',
        'combustivel',
        'km',
        'descricao',
        'imagem_principal',
        'imagens',
        'placa',
        'ativo',
        'destaque',
        ...self::CAMPOS_INTERNOS,
    ];

    // Dados que só existem no painel. Ficam fora de qualquer JSON enviado ao site.
    public const CAMPOS_INTERNOS = [
        'preco_compra',
        'custo_reforma',
        'preco_minimo',
        'renavam',
        'chassi',
        'ipva_situacao',
        'licenciamento_ano',
        'multas',
        'gravame',
        'origem',
        'fornecedor',
        'data_entrada',
        'situacao',
        'data_venda',
        'comprador',
        'local_estoque',
        'observacoes',
        'fipe_codigo',
        'fipe_valor',
        'fipe_referencia',
        'fipe_consultado_em',
        'teste',
    ];

    public const CAMPOS_FINANCEIROS = ['preco_compra', 'custo_reforma', 'preco_minimo'];

    protected $hidden = self::CAMPOS_INTERNOS;

    protected $casts = [
        'preco'          => 'decimal:2',
        'ativo'          => 'boolean',
        'destaque'       => 'boolean',
        'imagens'        => 'array',
        'preco_compra'   => 'decimal:2',
        'custo_reforma'  => 'decimal:2',
        'preco_minimo'   => 'decimal:2',
        'multas'         => 'boolean',
        'gravame'        => 'boolean',
        'data_entrada'   => 'date:Y-m-d',
        'data_venda'     => 'date:Y-m-d',
        'fipe_valor'     => 'decimal:2',
        'fipe_consultado_em' => 'date:Y-m-d',
        'teste' => 'boolean',
    ];

    protected $appends = ['slug', 'url'];

    public function getSlugAttribute(): string
    {
        // Remove a marca duplicada do modelo (ex: modelo cadastrado como
        // "Ford Ka" com marca "Ford") para não gerar URLs como
        // /carro/51-ford-ford-ka-2020.
        $modelo = TextFormat::tituloModelo($this->marca, $this->modelo);

        return Str::slug("{$this->marca}-{$modelo}-{$this->ano}");
    }

    public function custos()
    {
        return $this->hasMany(CustoCarro::class);
    }

    public function getUrlAttribute(): string
    {
        return "/carro/{$this->id}-{$this->slug}";
    }
}
