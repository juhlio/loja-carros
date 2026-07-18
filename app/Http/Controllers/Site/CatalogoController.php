<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Carro;
use Inertia\Inertia;

class CatalogoController extends Controller
{
    public function index()
    {
        $carros = Carro::where("ativo", true)->orderBy("created_at", "desc")->get();
        return Inertia::render("Site/Catalogo", ["carros" => $carros]);
    }

    public function show($id)
    {
        $carro = Carro::where("ativo", true)->findOrFail($id);
        return Inertia::render("Site/DetalheCarro", ["carro" => $carro]);
    }
}
