<?php

use App\Http\Controllers\AdjustmentCategoryController;
use App\Http\Controllers\AdjustmentController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\HoldController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleReturnController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\StockLogController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/auth/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('adjustment', AdjustmentController::class);
    Route::apiResource('adjustment-category', AdjustmentCategoryController::class)->parameter('adjustment-category', 'adjustmentCategory');
    Route::apiResource('brand', BrandController::class);
    Route::apiResource('category', CategoryController::class);
    Route::apiResource('customer', CustomerController::class);
    Route::apiResource('expense', ExpenseController::class);
    Route::apiResource('expense-category', ExpenseCategoryController::class)->parameter('expense-category', 'expenseCategory');
    Route::apiResource('hold', HoldController::class);
    Route::apiResource('payment', PaymentController::class);
    Route::apiResource('payment-method', PaymentMethodController::class)->parameter('payment-method', 'paymentMethod');
    Route::apiResource('pos', PosController::class);
    Route::apiResource('product', ProductController::class);
    Route::apiResource('purchase', PurchaseController::class);
    Route::apiResource('purchase-return', PurchaseReturnController::class)->parameter('purchase-return', 'purchaseReturn');
    Route::apiResource('sale', SaleController::class);
    Route::apiResource('sale-return', SaleReturnController::class)->parameter('sale-return', 'saleReturn');
    Route::apiResource('stock', StockController::class);
    Route::apiResource('stock-log', StockLogController::class);
    Route::apiResource('supplier', SupplierController::class);
    Route::apiResource('unit', UnitController::class);
    Route::apiResource('user', UserController::class);
});
