<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleReturn\StoreSaleReturnRequest;
use App\Http\Requests\SaleReturn\UpdateSaleReturnRequest;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Repositories\SaleReturnRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

// use Illuminate\Routing\Controllers\Middleware;

class SaleReturnController extends Controller implements HasMiddleware
{
    public function __construct(protected SaleReturnRepository $repository) {}

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
    public function store(StoreSaleReturnRequest $request, Sale $sale)
    {
        $model = $this->repository->store($request->validated(), $sale);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(SaleReturn $saleReturn)
    {
        $data = $this->repository->toData(
            $this->repository->tableQuery()->find($saleReturn->id)
        );

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws \Throwable
     */
    public function update(UpdateSaleReturnRequest $request, SaleReturn $saleReturn)
    {
        $model = $this->repository->edit($request->validated(), $saleReturn);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \Throwable
     */
    public function destroy(SaleReturn $saleReturn)
    {
        $this->repository->destroy($saleReturn);

        return ApiResponse::data();
    }
}
