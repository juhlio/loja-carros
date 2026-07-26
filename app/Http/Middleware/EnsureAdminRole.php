<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $admin = Admin::find(session('admin_id'));

        if (!$admin || !$admin->isAdmin()) {
            abort(403, 'Sem permissao para acessar esta area.');
        }

        return $next($request);
    }
}
