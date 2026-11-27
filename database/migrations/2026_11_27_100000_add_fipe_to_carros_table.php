<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("carros", function (Blueprint $table) {
            $table->string("fipe_codigo", 20)->nullable();
            $table->decimal("fipe_valor", 10, 2)->nullable();
            $table->string("fipe_referencia", 50)->nullable();
            $table->date("fipe_consultado_em")->nullable();
        });
    }

    public function down(): void
    {
        Schema::table("carros", function (Blueprint $table) {
            $table->dropColumn(["fipe_codigo", "fipe_valor", "fipe_referencia", "fipe_consultado_em"]);
        });
    }
};
