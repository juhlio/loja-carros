<?php

namespace App\Console\Commands;

use App\Models\Carro;
use App\Support\ImagePipeline;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class BackfillThumbnailsCarros extends Command
{
    protected $signature = 'carros:backfill-thumbnails';

    protected $description = 'Gera as thumbnails ausentes de fotos de carros já cadastradas (ex: enviadas antes do pipeline de thumbnails existir)';

    public function handle(): int
    {
        $carros = Carro::whereNotNull('imagens')->get();

        $geradas = 0;
        $ausentes = 0;

        foreach ($carros as $carro) {
            foreach ($carro->imagens ?? [] as $caminho) {
                if (!Storage::disk('public')->exists($caminho)) {
                    $this->warn("Carro #{$carro->id}: imagem principal ausente ({$caminho})");
                    $ausentes++;
                    continue;
                }

                if (ImagePipeline::backfillThumb($caminho)) {
                    $this->info("Carro #{$carro->id}: thumbnail gerada para {$caminho}");
                    $geradas++;
                }
            }
        }

        $this->info("Concluído: {$geradas} thumbnails geradas, {$ausentes} imagens principais ausentes.");

        return self::SUCCESS;
    }
}
