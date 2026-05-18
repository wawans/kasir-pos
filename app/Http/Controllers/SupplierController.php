<?php

namespace App\Http\Controllers;

use App\Data\SupplierData;
use App\Models\Supplier;
use App\Repositories\SupplierRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
// use Illuminate\Routing\Controllers\Middleware;

class SupplierController extends Controller implements HasMiddleware
{
    public function __construct(protected SupplierRepository $repository) {}

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
     */
    public function store(SupplierData $request)
    {
        $model = $this->repository->store($request->toArray());
        $data = $this->repository->toData($model);
        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        $data = $this->repository->toData($supplier);
        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SupplierData $request, Supplier $supplier)
    {
        $model = $this->repository->edit($request->toArray(), $supplier);
        $data = $this->repository->toData($model);
        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $this->repository->destroy($supplier);
        return ApiResponse::data();
    }
}
