<?php

namespace App\Http\Controllers;

use App\Data\CategoryData;
use App\Models\Category;
use App\Repositories\CategoryRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

// use Illuminate\Routing\Controllers\Middleware;

class CategoryController extends Controller implements HasMiddleware
{
    public function __construct(protected CategoryRepository $repository) {}

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
    public function store(CategoryData $request)
    {
        $model = $this->repository->store($request->toArray());
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $data = $this->repository->toData($category);

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryData $request, Category $category)
    {
        Validator::make($request->toArray(), [
            'name' => [
                Rule::unique(Category::class)->ignore($category->id),
            ],
        ])->validate();

        $model = $this->repository->edit($request->toArray(), $category);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->repository->destroy($category);

        return ApiResponse::data();
    }
}
