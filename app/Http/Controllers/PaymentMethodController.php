<?php

namespace App\Http\Controllers;

use App\Data\PaymentMethodData;
use App\Models\PaymentMethod;
use App\Repositories\PaymentMethodRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

// use Illuminate\Routing\Controllers\Middleware;

class PaymentMethodController extends Controller implements HasMiddleware
{
    public function __construct(protected PaymentMethodRepository $repository) {}

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
    public function store(PaymentMethodData $request)
    {
        $model = $this->repository->store($request->toArray());
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentMethod $paymentMethod)
    {
        $data = $this->repository->toData($paymentMethod);

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PaymentMethodData $request, PaymentMethod $paymentMethod)
    {
        Validator::make($request->toArray(), [
            'name' => [
                Rule::unique(PaymentMethod::class)->ignore($paymentMethod->id),
            ],
        ])->validate();

        $model = $this->repository->edit($request->toArray(), $paymentMethod);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        $this->repository->destroy($paymentMethod);

        return ApiResponse::data();
    }
}
