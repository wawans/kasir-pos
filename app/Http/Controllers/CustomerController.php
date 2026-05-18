<?php

namespace App\Http\Controllers;

use App\Data\CustomerData;
use App\Models\Customer;
use App\Repositories\CustomerRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

// use Illuminate\Routing\Controllers\Middleware;

class CustomerController extends Controller implements HasMiddleware
{
    public function __construct(protected CustomerRepository $repository) {}

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
    public function store(CustomerData $request)
    {
        $model = $this->repository->store($request->toArray());
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $data = $this->repository->toData($customer);

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerData $request, Customer $customer)
    {
        $model = $this->repository->edit($request->toArray(), $customer);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $this->repository->destroy($customer);

        return ApiResponse::data();
    }
}
