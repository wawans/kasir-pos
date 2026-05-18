<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/auth/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('brand', BrandController::class)->names('brand');
    Route::apiResource('customer', CustomerController::class)->names('customer');
    Route::apiResource('supplier', SupplierController::class)->names('supplier');
    Route::apiResource('user', UserController::class)->names('user');
});
