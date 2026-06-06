<?php

namespace App\Http\Controllers;

use App\Http\Requests\Sale\StoreSaleRequest;
use App\Http\Requests\Sale\UpdateSaleRequest;
use App\Models\Sale;
use App\Repositories\SaleRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

// use Illuminate\Routing\Controllers\Middleware;

class SaleController extends Controller implements HasMiddleware
{
    public function __construct(protected SaleRepository $repository) {}

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
        $model = $this->repository->table();

        return ApiResponse::make($model);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws \Throwable
     */
    public function store(StoreSaleRequest $request)
    {
        $model = $this->repository->store($request->validated());
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $data = $this->repository->toData(
            $this->repository->tableQuery()->find($sale->id)
        );

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws \Throwable
     */
    public function update(UpdateSaleRequest $request, Sale $sale)
    {
        $model = $this->repository->edit($request->validated(), $sale);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \Throwable
     */
    public function destroy(Sale $sale)
    {
        $this->repository->destroy($sale);

        return ApiResponse::data();
    }
}
