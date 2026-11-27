<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("carros", function (Blueprint $table) {
            // Financeiro: visível só para admin e super_admin.
            $table->decimal("preco_compra", 10, 2)->nullable();
            $table->decimal("custo_reforma", 10, 2)->nullable();
            $table->decimal("preco_minimo", 10, 2)->nullable();

            // Documentação.
            $table->string("renavam", 20)->nullable();
            $table->string("chassi", 30)->nullable();
            $table->string("ipva_situacao", 20)->nullable();
            $table->integer("licenciamento_ano")->nullable();
            $table->boolean("multas")->default(false);
            $table->boolean("gravame")->default(false);

            // Origem.
            $table->string("origem", 30)->nullable();
            $table->string("fornecedor")->nullable();
            $table->date("data_entrada")->nullable();

            // Situação.
            $table->string("situacao", 20)->default("disponivel");
            $table->date("data_venda")->nullable();
            $table->string("comprador")->nullable();
            $table->string("local_estoque")->nullable();

            // Observações internas.
            $table->text("observacoes")->nullable();
        });
    }

    public function down(): void
    {
        Schema::table("carros", function (Blueprint $table) {
            $table->dropColumn([
                "preco_compra", "custo_reforma", "preco_minimo",
                "renavam", "chassi", "ipva_situacao", "licenciamento_ano", "multas", "gravame",
                "origem", "fornecedor", "data_entrada",
                "situacao", "data_venda", "comprador", "local_estoque",
                "observacoes",
            ]);
        });
    }
};
