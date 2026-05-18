<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/auth/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('brand', App\Http\Controllers\BrandController::class)->names('brand');
    Route::apiResource('customer', App\Http\Controllers\CustomerController::class)->names('customer');
    Route::apiResource('supplier', App\Http\Controllers\SupplierController::class)->names('supplier');
    Route::apiResource('user', UserController::class)->names('user');
});
