<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CarroController extends Controller
{
    public function index()
    {
        $carros = Carro::all();
        return Inertia::render("Admin/Carros/Index", ["carros" => $carros]);
    }

    public function create()
    {
        return Inertia::render("Admin/Carros/Create");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "marca"       => "required|string",
            "modelo"      => "required|string",
            "ano"         => "required|integer",
            "preco"       => "required|numeric",
            "cor"         => "required|string",
            "combustivel" => "required|string",
            "km"          => "required|integer",
            "descricao"   => "nullable|string",
            "placa"       => "required|unique:carros",
        ]);

        Carro::create($validated);

        return redirect()->route("carros.index")->with("message", "Carro adicionado com sucesso!");
    }

    public function edit(Carro $carro)
    {
        return Inertia::render("Admin/Carros/Edit", ["carro" => $carro]);
    }

    public function update(Request $request, Carro $carro)
    {
        $validated = $request->validate([
            "marca"       => "required|string",
            "modelo"      => "required|string",
            "ano"         => "required|integer",
            "preco"       => "required|numeric",
            "cor"         => "required|string",
            "combustivel" => "required|string",
            "km"          => "required|integer",
            "descricao"   => "nullable|string",
            "placa"       => "required|unique:carros,placa," . $carro->id,
        ]);

        $carro->update($validated);

        return redirect()->route("carros.index")->with("message", "Carro atualizado com sucesso!");
    }

    public function destroy(Carro $carro)
    {
        $carro->delete();

        return redirect()->route("carros.index")->with("message", "Carro deletado com sucesso!");
    }
}
