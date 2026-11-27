<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    private array $chaves = [
        "nome_loja", "descricao", "telefone", "whatsapp",
        "email", "endereco_titulo", "endereco", "endereco_2_titulo", "endereco_2", "logo",
        "sobre_titulo", "sobre_texto",
        "anos_mercado", "carros_vendidos", "avaliacao_google",
    ];

    private array $padroes = [
        "nome_loja"        => "Loja de Carros",
        "sobre_titulo"     => "Quem somos",
        "anos_mercado"     => "12",
        "carros_vendidos"  => "+500",
        "avaliacao_google" => "4,9",
        "endereco_titulo"  => "Loja 1",
        "endereco_2_titulo"=> "Loja 2",
    ];

    public function index()
    {
        $settings = [];
        foreach ($this->chaves as $chave) {
            $settings[$chave] = Setting::get($chave, $this->padroes[$chave] ?? "");
        }

        return Inertia::render("Admin/Configuracoes/Index", ["settings" => $settings]);
    }

    public function update(Request $request)
    {
        $request->validate([
            "nome_loja"        => "required|string",
            "descricao"        => "nullable|string",
            "telefone"         => "nullable|string",
            "whatsapp"         => "nullable|string",
            "email"            => "nullable|email",
            "endereco_titulo"  => "nullable|string",
            "endereco"         => "nullable|string",
            "endereco_2_titulo"=> "nullable|string",
            "endereco_2"       => "nullable|string",
            "logo"             => "nullable|image|mimes:jpeg,png,jpg,gif|max:20480",
            "sobre_titulo"     => "nullable|string",
            "sobre_texto"      => "nullable|string",
            "anos_mercado"     => ["nullable", "regex:/^[0-9]{1,2}$/"],
            "carros_vendidos"  => ["nullable", "regex:/^\+?[0-9]{1,6}$/"],
            "avaliacao_google" => ["nullable", "regex:/^[0-5]([.,][0-9])?$/"],
        ], [
            "anos_mercado.regex"     => "Use só números, por exemplo 12.",
            "carros_vendidos.regex"  => "Use só números, por exemplo +500.",
            "avaliacao_google.regex" => "Use uma nota de 0 a 5, por exemplo 4,9.",
        ]);

        if ($request->hasFile("logo")) {
            $logoAntiga = Setting::get("logo");
            if ($logoAntiga) {
                Storage::disk("public")->delete($logoAntiga);
            }
            Setting::set("logo", $request->file("logo")->store("logo", "public"));
        }

        $campos = array_filter(
            $this->chaves,
            fn($c) => $c !== "logo"
        );

        foreach ($campos as $chave) {
            Setting::set($chave, $request->input($chave, ""));
        }

        return back()->with("message", "Configuracoes atualizadas com sucesso!");
    }
}
