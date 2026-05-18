<?php

namespace App\Repositories;

use App\Data\BrandData;
use App\Repositories\Concerns\WithTable;
use App\Repositories\Repository;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\BrandRepository
 *
 * @property \App\Models\Brand $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Brand query()
 * @method \App\Models\Brand update(array $attributes, \App\Models\Brand $brand)
 */
class BrandRepository extends Repository
{
     use WithTable;

    /**
     * Create a new repository instance.
     *
     * @param \App\Models\Brand $model
     */
    public function __construct(protected \App\Models\Brand $model)
    {
    }

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters(...$this->model->getFillable())
            ->allowedSorts(...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return BrandData::collect($data);
    }

    public function toData($model)
    {
        return BrandData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param array $attributes
     * @return \App\Models\Brand
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param array $attributes
     * @param \App\Models\Brand $brand
     * @return \App\Models\Brand
     */
    public function edit($attributes, \App\Models\Brand $brand)
    {
        return $this->update($attributes, $brand);
    }

    /**
     * Delete the model from the database.
     *
     * @param \App\Models\Brand $brand
     * @return bool|null|void
     */
    public function destroy(\App\Models\Brand $brand)
    {
        return $this->delete($brand);
    }
}
