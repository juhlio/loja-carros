<?php

namespace App\Http\Middleware;

use App\Models\Admin;
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
        $adminId = session("admin_id");
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
        ];
    }
}
