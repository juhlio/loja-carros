<?php

namespace App\Models;

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
        return Str::slug("{$this->marca}-{$this->modelo}-{$this->ano}");
    }

    public function getUrlAttribute(): string
    {
        return "/carro/{$this->id}-{$this->slug}";
    }
}
