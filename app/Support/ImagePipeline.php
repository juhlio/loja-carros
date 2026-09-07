<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImagePipeline
{
    public const MAIN_WIDTH = 1200;

    public const MAIN_HEIGHT = 675;

    public const THUMB_WIDTH = 400;

    public const THUMB_HEIGHT = 200;

    /**
     * Recebe o upload de uma foto de carro, gera as variantes WebP
     * (principal + thumbnail) e retorna o caminho da imagem principal
     * para ser salvo no campo `imagens` do carro.
     */
    public static function processUpload(UploadedFile $file, string $directory = 'carros'): string
    {
        return self::processContent($file->getRealPath(), $directory);
    }

    /**
     * Mesma coisa, mas a partir de conteúdo binário já em memória (usado
     * no comando de conversão em lote das imagens já existentes).
     */
    public static function processContent(mixed $content, string $directory = 'carros'): string
    {
        $manager = new ImageManager(new Driver());
        $hash = Str::random(40);

        $main = $manager->read($content)
            ->cover(self::MAIN_WIDTH, self::MAIN_HEIGHT)
            ->toWebp(82);

        $thumb = $manager->read($content)
            ->cover(self::THUMB_WIDTH, self::THUMB_HEIGHT)
            ->toWebp(78);

        $mainPath = "{$directory}/{$hash}.webp";
        $thumbPath = self::thumbPath($mainPath);

        Storage::disk('public')->put($mainPath, (string) $main);
        Storage::disk('public')->put($thumbPath, (string) $thumb);

        return $mainPath;
    }

    /**
     * Deriva o caminho da variante thumbnail a partir do caminho da
     * imagem principal (mesmo diretório, subpasta "thumb").
     */
    public static function thumbPath(string $mainPath): string
    {
        $ultimaBarra = strrpos($mainPath, '/');

        if ($ultimaBarra === false) {
            return "thumb/{$mainPath}";
        }

        $diretorio = substr($mainPath, 0, $ultimaBarra);
        $arquivo = substr($mainPath, $ultimaBarra + 1);

        return "{$diretorio}/thumb/{$arquivo}";
    }

    /**
     * Remove a imagem principal e sua variante thumbnail do disco.
     */
    public static function delete(string $mainPath): void
    {
        Storage::disk('public')->delete([$mainPath, self::thumbPath($mainPath)]);
    }
}
