<?php

namespace Database\Seeders;

use App\Models\Carro;
use App\Models\CustoCarro;
use Illuminate\Database\Seeder;

// Dados fictícios para o ambiente de teste. Não usar em produção.
class CarrosExemploSeeder extends Seeder
{
    public function run(): void
    {
        $carros = [
            ['Volkswagen', 'Polo Highline', 2024, 94000, 'Branco', 'gasolina', 12000, 'EXE1A23', 'vendido',  78000, 'fornecedor', true],
            ['Toyota', 'Corolla XEi', 2023, 118000, 'Prata', 'gasolina', 35000, 'EXE2B34', 'disponivel', 95000, 'troca', true],
            ['Fiat', 'Strada Freedom', 2022, 98000, 'Vermelho', 'diesel', 48000, 'EXE3C45', 'reservado', 80000, 'compra_particular', true],
            ['Jeep', 'Compass Limited', 2020, 99000, 'Preto', 'diesel', 62000, 'EXE4D56', 'em_reparo', 84000, 'consignado', true],
            ['Honda', 'Civic Touring', 2019, 132000, 'Cinza', 'hibrido', 41000, 'EXE5E67', 'disponivel', null, null, false],
            ['Hyundai', 'HB20 Vision', 2020, 62000, 'Branco', 'gasolina', 55000, 'EXE6F78', 'disponivel', 47000, 'compra_particular', true],
        ];

        foreach ($carros as [$marca, $modelo, $ano, $preco, $cor, $combustivel, $km, $placa, $situacao, $precoCompra, $origem, $ativo]) {
            $carro = Carro::create([
                'marca' => $marca,
                'modelo' => $modelo,
                'ano' => $ano,
                'preco' => $preco,
                'cor' => $cor,
                'combustivel' => $combustivel,
                'km' => $km,
                'placa' => $placa,
                'descricao' => 'Veículo de exemplo para teste.',
                'imagens' => [],
                'situacao' => $situacao,
                'origem' => $origem,
                'preco_compra' => $precoCompra,
                'data_entrada' => now()->subDays(random_int(5, 90))->toDateString(),
                'ativo' => $ativo,
            ]);

            CustoCarro::create([
                'carro_id' => $carro->id,
                'descricao' => 'Troca de óleo e filtro',
                'categoria' => 'manutencao',
                'valor' => 320,
                'data' => now()->subDays(random_int(1, 30))->toDateString(),
            ]);
        }
    }
}
