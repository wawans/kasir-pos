<?php

namespace App\Http\Controllers;

use App\Data\ProductData;
use App\Models\Product;
use App\Repositories\ProductRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

// use Illuminate\Routing\Controllers\Middleware;

class ProductController extends Controller implements HasMiddleware
{
    public function __construct(protected ProductRepository $repository) {}

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
    public function store(ProductData $request)
    {
        Validator::make($request->toArray(), [
            'name' => [
                Rule::unique(Product::class),
            ],
            'code' => [
                'sometimes', 'nullable', 'string',
                Rule::unique(Product::class),
            ],
        ])->validate();

        $model = $this->repository->store($request->toArray());
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $data = $this->repository->toData($product);

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductData $request, Product $product)
    {
        Validator::make($request->toArray(), [
            'name' => [
                Rule::unique(Product::class)->ignore($product->id),
            ],
            'code' => [
                'sometimes', 'nullable', 'string',
                Rule::unique(Product::class)->ignore($product->id),
            ],
        ])->validate();

        $model = $this->repository->edit($request->toArray(), $product);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->repository->destroy($product);

        return ApiResponse::data();
    }
}
