<?php

namespace App\Http\Controllers;

use App\Data\PosData;
use App\Models\Pos;
use App\Repositories\PosRepository;
use App\Support\Response\ApiResponse;
use Illuminate\Routing\Controllers\HasMiddleware;

// use Illuminate\Routing\Controllers\Middleware;

class PosController extends Controller implements HasMiddleware
{
    public function __construct(protected PosRepository $repository) {}

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
    public function store(PosData $request)
    {
        $model = $this->repository->store($request->toArray());
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pos $pos)
    {
        $data = $this->repository->toData($pos);

        return ApiResponse::data($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PosData $request, Pos $pos)
    {
        $model = $this->repository->edit($request->toArray(), $pos);
        $data = $this->repository->toData($model);

        return ApiResponse::data($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pos $pos)
    {
        abort(404);
        // $this->repository->destroy($pos);

        // return ApiResponse::data();
    }
}
