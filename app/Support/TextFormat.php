<?php

namespace App\Support;

class TextFormat
{
    public static function tituloVeiculo(?string $str): string
    {
        if (!$str) {
            return '';
        }

        return implode(' ', array_map(
            fn ($parte) => implode('-', array_map([self::class, 'tituloPalavra'], explode('-', $parte))),
            explode(' ', $str)
        ));
    }

    private static function tituloPalavra(string $word): string
    {
        if (preg_match('/\d/', $word) || mb_strlen($word) <= 3) {
            return mb_strtoupper($word);
        }

        return mb_strtoupper(mb_substr($word, 0, 1)) . mb_strtolower(mb_substr($word, 1));
    }
}
