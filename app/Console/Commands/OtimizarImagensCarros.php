<?php

namespace App\Console\Commands;

use App\Models\Carro;
use App\Support\ImagePipeline;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OtimizarImagensCarros extends Command
{
    protected $signature = 'carros:otimizar-imagens';

    protected $description = 'Converte as fotos de carros já cadastradas para WebP (principal + thumbnail), reduzindo o peso servido';

    public function handle(): int
    {
        $carros = Carro::whereNotNull('imagens')->get();

        $convertidas = 0;
        $puladas = 0;
        $ausentes = 0;

        foreach ($carros as $carro) {
            $imagensAtuais = $carro->imagens ?? [];
            $novasImagens = [];
            $alterou = false;

            foreach ($imagensAtuais as $caminho) {
                if (Str::endsWith($caminho, '.webp')) {
                    $novasImagens[] = $caminho;
                    $puladas++;
                    continue;
                }

                if (!Storage::disk('public')->exists($caminho)) {
                    $this->warn("Arquivo não encontrado, mantendo referência: {$caminho}");
                    $novasImagens[] = $caminho;
                    $ausentes++;
                    continue;
                }

                $conteudoOriginal = Storage::disk('public')->get($caminho);
                $diretorio = trim(dirname($caminho), '.');
                $diretorio = $diretorio === '' ? 'carros' : $diretorio;

                $novoCaminho = ImagePipeline::processContent($conteudoOriginal, $diretorio);

                Storage::disk('public')->delete($caminho);

                $novasImagens[] = $novoCaminho;
                $convertidas++;
                $alterou = true;
            }

            if ($alterou) {
                $carro->imagens = $novasImagens;
                $carro->save();
                $this->info("Carro #{$carro->id} ({$carro->marca} {$carro->modelo}): imagens convertidas");
            }
        }

        $this->info("Concluído: {$convertidas} imagens convertidas, {$puladas} já em WebP, {$ausentes} arquivos ausentes.");

        return self::SUCCESS;
    }
}
