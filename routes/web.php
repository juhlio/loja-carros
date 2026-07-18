<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Site\CatalogoController;

Route::get("/", function () {
    return Inertia::render("Welcome");
});

Route::get("/catalogo",      [CatalogoController::class, "index"]);
Route::get("/carro/{id}",    [CatalogoController::class, "show"]);

Route::prefix("admin")->name("admin.")->group(function () {
    Route::resource("carros", \App\Http\Controllers\Admin\CarroController::class);
});
