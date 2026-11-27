<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustoCarro extends Model
{
    protected $table = "custos_carros";

    // Custos extras (troca de óleo, pneus etc). Só aparecem no painel, para admin.
    public const CATEGORIAS = [
        'manutencao'   => 'Manutenção',
        'pneus'        => 'Pneus',
        'funilaria'    => 'Funilaria e pintura',
        'documentacao' => 'Documentação e taxas',
        'estetica'     => 'Estética',
        'outros'       => 'Outros',
    ];

    protected $fillable = ['carro_id', 'descricao', 'categoria', 'valor', 'data'];

    protected $casts = [
        'valor' => 'decimal:2',
        'data'  => 'date:Y-m-d',
    ];

    public function carro()
    {
        return $this->belongsTo(Carro::class);
    }
}
