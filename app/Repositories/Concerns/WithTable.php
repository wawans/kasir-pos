<?php

namespace App\Repositories\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\QueryBuilder;

trait WithTable
{
    /**
     * Pagination page `selector` name.
     *
     * @var string
     */
    public $pageName = 'page';

    /**
     * Pagination per page count `selector` name.
     *
     * @var string
     */
    public $perPageName = 'perPage';

    /**
     * Pagination per page count default value.
     *
     * @var string
     */
    public $perPage = 15;

    /**
     * Filter sort by `selector` name.
     *
     * @var string|array|null
     */
    public $sortByName = 'sortBy';

    /**
     * Filter sort direction `selector` name.
     *
     * @var string|array|null asc or desc
     */
    public $sortDirectionName = 'sortDirection';

    public function tableQuery()
    {
        return QueryBuilder::for($this->query());
    }

    public function table()
    {
        $withPagination = request()->has($this->perPageName) || request()->has($this->pageName);

        $perPage = request()->get($this->perPageName, $this->perPage);
        $page = request()->get($this->pageName, 1);

        $sortBy = request()->get($this->sortByName, $this->sortBy ?? null);
        $sortBy = $sortBy && Str::contains($sortBy, ',') ? collect(explode(',', $sortBy))->filter()->all() : $sortBy;
        $sortDirection = request()->get($this->sortDirectionName, $this->sortDirection ?? 'asc');
        $sortDirection = Str::contains($sortDirection, ',') ? collect(explode(',', $sortDirection))->filter()->all() : $sortDirection;

        $query = $this->tableQuery()
            ->when(! is_null($sortBy) && ! blank($sortBy), function ($query) use ($sortBy, $sortDirection) {
                /** @var Builder $query */
                if (is_array($sortBy) && is_array($sortDirection)) {
                    foreach ($sortBy as $index => $item) {
                        $query->orderBy($item, $sortDirection[$index] ?? 'asc');
                    }
                } elseif (is_array($sortBy) && ! is_array($sortDirection)) {
                    foreach ($sortBy as $item) {
                        $query->orderBy($item, $sortDirection);
                    }
                } else {
                    $query->orderBy($sortBy, $sortDirection);
                }
            });

        $result = $withPagination
            ? $query->paginate($perPage, ['*'], $this->pageName, $page)->withQueryString()
            : (new Paginator($query->get(), $query->get()->count(), null, [
                'path' => Paginator::resolveCurrentPath(),
            ]))->withQueryString();

        return method_exists($this, 'toCollection') ? $this->toCollection($result) : $result;
    }

    public function toArray($model)
    {
        return array_merge($model instanceof \stdClass ? get_object_vars($model) : $model->toArray(),
            $model->timestamps ? [
                $model->getCreatedAtColumn() => $model->{$model->getCreatedAtColumn()}?->toDateTimeString(),
                $model->getUpdatedAtColumn() => $model->{$model->getUpdatedAtColumn()}?->toDateTimeString(),
            ] : [],
        );
    }

    public function toData($model)
    {
        return $this->toArray($model);
    }
}
