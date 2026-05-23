<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Repositories\StockRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

// use Illuminate\Routing\Controllers\Middleware;

class StockController extends Controller implements HasMiddleware
{
    // public function __construct(protected StockRepository $repository) {}

    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            // new Middleware('can:-index'),
            // new Middleware('can:-create', only: ['create', 'store']),
            // new Middleware('can:-update', only: ['edit', 'update']),
            // new Middleware('can:-delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $model = $this->repository->table();
        // return ApiResponse::make($model);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $model = $this->repository->store($request->validated());
        // $data = $this->repository->toData($model);
        // return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        // $data = $this->repository->toData($stock);
        // return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        // $model = $this->repository->edit($request->validated(), $stock);
        // $data = $this->repository->toData($model);
        // return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        // $this->repository->destroy($stock);
        // return ApiResponse::data();
    }
}
