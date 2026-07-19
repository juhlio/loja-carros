<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = "settings";

    protected $fillable = ["chave", "valor"];

    public static function get($chave, $padrao = null)
    {
        $setting = self::where("chave", $chave)->first();
        return $setting ? $setting->valor : $padrao;
    }

    public static function set($chave, $valor)
    {
        return self::updateOrCreate(
            ["chave" => $chave],
            ["valor" => $valor]
        );
    }
}
