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
        "email", "endereco", "logo",
        "sobre_titulo", "sobre_texto",
        "anos_mercado", "carros_vendidos", "avaliacao_google",
    ];

    private array $padroes = [
        "nome_loja"       => "Loja de Carros",
        "sobre_titulo"    => "Quem somos",
        "anos_mercado"    => "12",
        "carros_vendidos" => "+500",
        "avaliacao_google"=> "4,9",
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
            "endereco"         => "nullable|string",
            "logo"             => "nullable|image|mimes:jpeg,png,jpg,gif|max:20480",
            "sobre_titulo"     => "nullable|string",
            "sobre_texto"      => "nullable|string",
            "anos_mercado"     => "nullable|string",
            "carros_vendidos"  => "nullable|string",
            "avaliacao_google" => "nullable|string",
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
