<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::truncate();

        Admin::create(["nome" => "Super Admin", "email" => "admin@loja.com",    "password" => "admin123",    "role" => "super_admin", "ativo" => true]);
        Admin::create(["nome" => "Gerente",     "email" => "gerente@loja.com",  "password" => "gerente123",  "role" => "admin",       "ativo" => true]);
        Admin::create(["nome" => "Vendedor",    "email" => "vendedor@loja.com", "password" => "vendedor123", "role" => "vendedor",    "ativo" => true]);
    }
}
