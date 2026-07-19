<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Site\CatalogoController;
use App\Http\Controllers\Auth\AuthController;

Route::get('/', fn () => Inertia::render('Welcome'));

Route::get('/catalogo',    [CatalogoController::class, 'index']);
Route::get('/carro/{id}',  [CatalogoController::class, 'show']);

Route::get('/login',  [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
    Route::resource('carros', \App\Http\Controllers\Admin\CarroController::class);
});
