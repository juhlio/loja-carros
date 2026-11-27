<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use App\Models\CustoCarro;
use Illuminate\Http\Request;

class CustoCarroController extends Controller
{
    public function store(Request $request, Carro $carro)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'categoria' => 'required|in:' . implode(',', array_keys(CustoCarro::CATEGORIAS)),
            'valor'     => 'required|numeric|min:0.01',
            'data'      => 'required|date',
        ]);

        $carro->custos()->create($validated);

        return back()->with('message', 'Custo adicionado com sucesso!');
    }

    public function destroy(Carro $carro, CustoCarro $custo)
    {
        abort_unless($custo->carro_id === $carro->id, 404);

        $custo->delete();

        return back()->with('message', 'Custo removido com sucesso!');
    }
}
