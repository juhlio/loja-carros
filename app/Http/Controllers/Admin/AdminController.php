<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render("Admin/Usuarios/Index", [
            "usuarios" => Admin::orderBy("role")->orderBy("nome")->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render("Admin/Usuarios/Create");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "nome"     => "required|string",
            "email"    => "required|email|unique:admins",
            "password" => "required|string|min:6",
            "role"     => "required|in:super_admin,admin,vendedor",
        ]);

        Admin::create($validated);

        return redirect()->route("admin.usuarios.index")->with("message", "Usuario criado com sucesso!");
    }

    public function edit(Admin $usuario)
    {
        return Inertia::render("Admin/Usuarios/Edit", ["usuario" => $usuario]);
    }

    public function update(Request $request, Admin $usuario)
    {
        $request->validate([
            "nome"     => "required|string",
            "email"    => "required|email|unique:admins,email," . $usuario->id,
            "password" => "nullable|string|min:6",
            "role"     => "required|in:super_admin,admin,vendedor",
            "ativo"    => "boolean",
        ]);

        $data = $request->only(["nome", "email", "role", "ativo"]);
        if ($request->filled("password")) {
            $data["password"] = $request->password;
        }

        $usuario->update($data);

        return redirect()->route("admin.usuarios.index")->with("message", "Usuario atualizado!");
    }

    public function destroy(Admin $usuario)
    {
        if ((int) session("admin_id") === $usuario->id) {
            return back()->withErrors(["error" => "Voce nao pode deletar sua propria conta"]);
        }

        $usuario->delete();

        return redirect()->route("admin.usuarios.index")->with("message", "Usuario deletado!");
    }

    public function perfil()
    {
        return Inertia::render("Admin/Perfil");
    }

    public function atualizarPerfil(Request $request)
    {
        $admin = Admin::find(session("admin_id"));

        $request->validate([
            "nome"       => "required|string",
            "email"      => "required|email|unique:admins,email," . $admin->id,
            "senha_atual"=> "nullable|string",
            "nova_senha" => "nullable|string|min:6|confirmed",
        ]);

        if ($request->nova_senha) {
            if (!$admin->validatePassword($request->senha_atual)) {
                return back()->withErrors(["senha_atual" => "Senha atual incorreta"]);
            }
            $admin->password = $request->nova_senha;
        }

        $admin->nome  = $request->nome;
        $admin->email = $request->email;
        $admin->save();

        return back()->with("message", "Perfil atualizado com sucesso!");
    }
}
