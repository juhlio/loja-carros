<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carro extends Model
{
    protected $fillable = [
        "marca",
        "modelo",
        "ano",
        "preco",
        "cor",
        "combustivel",
        "km",
        "descricao",
        "imagem_principal",
        "placa",
        "ativo",
    ];

    protected $casts = [
        "preco" => "decimal:2",
        "ativo" => "boolean",
    ];
}
