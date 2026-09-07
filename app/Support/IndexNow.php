<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IndexNow
{
    private const KEY = 'b482510888434cbdf69530b8dc87e5dd';

    private const ENDPOINT = 'https://api.indexnow.org/indexnow';

    /**
     * Avisa os motores de busca compatíveis com IndexNow (Bing, Yandex e
     * outros) que uma ou mais URLs mudaram, para indexação quase imediata
     * em vez de esperar o próximo rastreamento agendado.
     */
    public static function submit(array $urls): void
    {
        $urls = array_values(array_filter($urls));

        if (empty($urls)) {
            return;
        }

        try {
            Http::timeout(3)->post(self::ENDPOINT, [
                'host' => parse_url(url('/'), PHP_URL_HOST),
                'key' => self::KEY,
                'keyLocation' => url('/' . self::KEY . '.txt'),
                'urlList' => $urls,
            ]);
        } catch (\Throwable $e) {
            Log::warning('IndexNow: falha ao notificar', ['error' => $e->getMessage(), 'urls' => $urls]);
        }
    }
}
