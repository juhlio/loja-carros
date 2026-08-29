<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = "app";

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $adminId   = session("admin_id");
        $adminAtual = $adminId ? Admin::find($adminId) : null;

        return [
            ...parent::share($request),
            "flash"      => fn () => ["message" => $request->session()->get("message")],
            "adminAtual" => $adminAtual ? [
                "id"   => $adminAtual->id,
                "nome" => $adminAtual->nome,
                "role" => $adminAtual->role,
                "ativo"=> $adminAtual->ativo,
            ] : null,
            "siteCfg" => fn () => [
                "nome_loja"  => Setting::get("nome_loja", "Loja de Carros"),
                "logo"       => Setting::get("logo"),
                "whatsapp"   => Setting::get("whatsapp", ""),
                "telefone"   => Setting::get("telefone", ""),
                "email"      => Setting::get("email", ""),
                "endereco_titulo"   => Setting::get("endereco_titulo", "Loja 1"),
                "endereco"          => Setting::get("endereco", ""),
                "endereco_2_titulo" => Setting::get("endereco_2_titulo", "Loja 2"),
                "endereco_2"        => Setting::get("endereco_2", ""),
                "anos_mercado"      => Setting::get("anos_mercado", "12"),
                "carros_vendidos"   => Setting::get("carros_vendidos", "+500"),
                "avaliacao_google"  => Setting::get("avaliacao_google", "4,9"),
                "sobre_titulo"      => Setting::get("sobre_titulo", "Quem somos"),
                "sobre_texto"       => Setting::get("sobre_texto", ""),
            ],
        ];
    }
}
