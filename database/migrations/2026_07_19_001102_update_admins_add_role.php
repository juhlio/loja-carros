<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("admins", function (Blueprint $table) {
            $table->enum("role", ["super_admin", "admin", "vendedor"])->default("vendedor")->after("password");
            $table->boolean("ativo")->default(true)->after("role");
        });
    }

    public function down(): void
    {
        Schema::table("admins", function (Blueprint $table) {
            $table->dropColumn(["role", "ativo"]);
        });
    }
};
