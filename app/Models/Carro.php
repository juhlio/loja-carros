<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $casts = [
        'preco'    => 'decimal:2',
        'ativo'    => 'boolean',
        'destaque' => 'boolean',
        'imagens'  => 'array',
    ];
}
