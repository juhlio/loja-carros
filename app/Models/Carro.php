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
    ];

    protected $casts = [
        'preco'    => 'decimal:2',
        'ativo'    => 'boolean',
        'destaque' => 'boolean',
        'imagens'  => 'array',
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

    public function getUrlAttribute(): string
    {
        return "/carro/{$this->id}-{$this->slug}";
    }
}
