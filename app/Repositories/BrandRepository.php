<?php

namespace App\Repositories;

use App\Data\BrandData;
use App\Models\Brand;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\BrandRepository
 *
 * @property Brand $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Brand query()
 * @method \App\Models\Brand update(array $attributes, \App\Models\Brand $brand)
 */
class BrandRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Brand $model) {}

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
     * @param  array  $attributes
     * @return Brand
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Brand
     */
    public function edit($attributes, Brand $brand)
    {
        return $this->update($attributes, $brand);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Brand $brand)
    {
        return $this->delete($brand);
    }
}
