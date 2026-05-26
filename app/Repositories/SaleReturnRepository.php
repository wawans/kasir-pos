<?php

namespace App\Repositories;

use App\Data\SaleReturnData;
use App\Models\SaleReturn;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\SaleReturnRepository
 *
 * @property SaleReturn $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\SaleReturn> query()
 * @method \App\Models\SaleReturn create(array $attributes)
 * @method \App\Models\SaleReturn update(array $attributes, \App\Models\SaleReturn $saleReturn)
 */
class SaleReturnRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected SaleReturn $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return SaleReturnData::collect($data);
    }

    public function toData($model)
    {
        return SaleReturnData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return SaleReturn
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return SaleReturn
     */
    public function edit($attributes, SaleReturn $saleReturn)
    {
        return $this->update($attributes, $saleReturn);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(SaleReturn $saleReturn)
    {
        return $this->delete($saleReturn);
    }
}
