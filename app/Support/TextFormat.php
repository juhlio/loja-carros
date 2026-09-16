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

    // Remove o prefixo da marca do modelo quando o cadastro já inclui a marca
    // no campo modelo (ex: marca "Ford" + modelo "Ford Ka" -> "Ka"), evitando
    // nomes duplicados como "Ford Ford Ka" ao concatenar marca + modelo.
    public static function tituloModelo(?string $marca, ?string $modelo): string
    {
        $marcaTitulo = self::tituloVeiculo($marca);
        $modeloTitulo = self::tituloVeiculo($modelo);

        if ($marcaTitulo && str_starts_with(mb_strtolower($modeloTitulo), mb_strtolower($marcaTitulo) . ' ')) {
            return trim(mb_substr($modeloTitulo, mb_strlen($marcaTitulo)));
        }

        return $modeloTitulo;
    }

    private static function tituloPalavra(string $word): string
    {
        if (preg_match('/\d/', $word) || mb_strlen($word) <= 3) {
            return mb_strtoupper($word);
        }

        return mb_strtoupper(mb_substr($word, 0, 1)) . mb_strtolower(mb_substr($word, 1));
    }
}
