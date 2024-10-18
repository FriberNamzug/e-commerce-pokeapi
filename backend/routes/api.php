<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/registro', [AuthController::class, 'registro']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::post('/products/precios', [ProductController::class, 'obtenerPrecioProductos']);


Route::post('/cart', [CartController::class, 'agregarAlCarrito'])->middleware('auth:sanctum');
Route::get('/cart', [CartController::class, 'obtenerCarrito'])->middleware('auth:sanctum');
Route::delete('/cart', [CartController::class, 'eliminarDelCarrito'])->middleware('auth:sanctum');
Route::delete('/cart/product', [CartController::class, 'eliminarProductoCompleto'])->middleware('auth:sanctum');
Route::delete('/cart/clear', [CartController::class, 'vaciarCarrito'])->middleware('auth:sanctum');


Route::post('/order', [OrderController::class, 'comprarProductos'])->middleware('auth:sanctum');
Route::get('/orders', [OrderController::class, 'obtenerOrdenes'])->middleware('auth:sanctum');
