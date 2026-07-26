<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !$admin->validatePassword($request->password)) {
            return back()->withErrors(['email' => 'Credenciais inválidas']);
        }

        $request->session()->regenerate();
        session(['admin_id' => $admin->id, 'admin_nome' => $admin->nome]);

        return redirect('/admin/carros');
    }

    public function logout(Request $request)
    {
        session()->forget(['admin_id', 'admin_nome']);
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
