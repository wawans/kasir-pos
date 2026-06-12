<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseReturn\StorePurchaseReturnRequest;
use App\Http\Requests\PurchaseReturn\UpdatePurchaseReturnRequest;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Repositories\PurchaseReturnRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

// use Illuminate\Routing\Controllers\Middleware;

class PurchaseReturnController extends Controller implements HasMiddleware
{
    public function __construct(protected PurchaseReturnRepository $repository) {}

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
    public function store(StorePurchaseReturnRequest $request, Purchase $purchase)
    {
        $model = $this->repository->store($request->validated(), $purchase);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseReturn $purchaseReturn)
    {
        $data = $this->repository->toData(
            $this->repository->tableQuery()->find($purchaseReturn->id)
        );

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws \Throwable
     */
    public function update(UpdatePurchaseReturnRequest $request, PurchaseReturn $purchaseReturn)
    {
        $model = $this->repository->edit($request->validated(), $purchaseReturn);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \Throwable
     */
    public function destroy(PurchaseReturn $purchaseReturn)
    {
        $this->repository->destroy($purchaseReturn);

        return ApiResponse::data();
    }
}
