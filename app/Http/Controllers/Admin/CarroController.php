<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarroController extends Controller
{
    public function index()
    {
        $carros = Carro::all();
        return Inertia::render('Admin/Carros/Index', ['carros' => $carros]);
    }

    public function create()
    {
        return Inertia::render('Admin/Carros/Create');
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
        ]);

        $imagens = [];
        if ($request->hasFile('imagens')) {
            foreach ($request->file('imagens') as $file) {
                $imagens[] = $file->store('carros', 'public');
            }
        }
        $validated['imagens'] = $imagens;

        Carro::create($validated);

        return redirect()->route('admin.carros.index')->with('message', 'Carro adicionado com sucesso!');
    }

    public function edit(Carro $carro)
    {
        return Inertia::render('Admin/Carros/Edit', ['carro' => $carro]);
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
        ]);

        $imagens = $carro->imagens ?? [];

        if ($request->hasFile('imagens')) {
            foreach ($imagens as $imagem) {
                Storage::disk('public')->delete($imagem);
            }
            $imagens = [];
            foreach ($request->file('imagens') as $file) {
                $imagens[] = $file->store('carros', 'public');
            }
        }
        $validated['imagens'] = $imagens;

        $carro->update($validated);

        return redirect()->route('admin.carros.index')->with('message', 'Carro atualizado com sucesso!');
    }

    public function destroy(Carro $carro)
    {
        if ($carro->imagens) {
            foreach ($carro->imagens as $imagem) {
                Storage::disk('public')->delete($imagem);
            }
        }
        $carro->delete();

        return redirect()->route('admin.carros.index')->with('message', 'Carro deletado com sucesso!');
    }
}
