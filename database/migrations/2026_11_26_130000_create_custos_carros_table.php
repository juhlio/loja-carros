<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("custos_carros", function (Blueprint $table) {
            $table->id();
            $table->foreignId("carro_id")->constrained("carros")->cascadeOnDelete();
            $table->string("descricao");
            $table->string("categoria", 30);
            $table->decimal("valor", 10, 2);
            $table->date("data");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("custos_carros");
    }
};
