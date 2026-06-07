<?php

namespace App\Http\Controllers;

use App\Data\ExpenseCategoryData;
use App\Models\ExpenseCategory;
use App\Repositories\ExpenseCategoryRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

// use Illuminate\Routing\Controllers\Middleware;

class ExpenseCategoryController extends Controller implements HasMiddleware
{
    public function __construct(protected ExpenseCategoryRepository $repository) {}

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
    public function store(ExpenseCategoryData $request)
    {
        $model = $this->repository->store($request->toArray());
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(ExpenseCategory $expenseCategory)
    {
        $data = $this->repository->toData(
            $this->repository->tableQuery()->find($expenseCategory->id)
        );

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws \Throwable
     */
    public function update(ExpenseCategoryData $request, ExpenseCategory $expenseCategory)
    {
        Validator::make($request->toArray(), [
            'name' => [
                Rule::unique(ExpenseCategory::class)->ignore($expenseCategory->id),
            ],
        ])->validate();

        $model = $this->repository->edit($request->toArray(), $expenseCategory);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \Throwable
     */
    public function destroy(ExpenseCategory $expenseCategory)
    {
        $this->repository->destroy($expenseCategory);

        return ApiResponse::data();
    }
}
