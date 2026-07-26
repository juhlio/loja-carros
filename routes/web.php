<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Site\CatalogoController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Auth\AuthController;

Route::get("/", [HomeController::class, "index"]);
Route::get("/catalogo",   [CatalogoController::class, "index"]);
Route::get("/carro/{id}", [CatalogoController::class, "show"]);

Route::get("/login",  [AuthController::class, "showLogin"])->name("login");
Route::post("/login", [AuthController::class, "login"])->middleware("throttle:5,1");
Route::get("/logout", [AuthController::class, "logout"])->name("logout");

Route::middleware("admin")->prefix("admin")->name("admin.")->group(function () {
    Route::resource("carros", \App\Http\Controllers\Admin\CarroController::class);
    Route::get("/perfil",  [\App\Http\Controllers\Admin\AdminController::class, "perfil"])->name("perfil");
    Route::put("/perfil",  [\App\Http\Controllers\Admin\AdminController::class, "atualizarPerfil"]);

    Route::middleware("role.admin")->group(function () {
        Route::resource("usuarios", \App\Http\Controllers\Admin\AdminController::class);
        Route::get("/configuracoes",  [\App\Http\Controllers\Admin\SettingsController::class, "index"])->name("configuracoes");
        Route::post("/configuracoes", [\App\Http\Controllers\Admin\SettingsController::class, "update"]);
    });
});
