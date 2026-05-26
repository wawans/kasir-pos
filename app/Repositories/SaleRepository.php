<?php

namespace App\Repositories;

use App\Data\SaleData;
use App\Models\Sale;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\SaleRepository
 *
 * @property Sale $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\Sale> query()
 * @method \App\Models\Sale create(array $attributes)
 * @method \App\Models\Sale update(array $attributes, \App\Models\Sale $sale)
 */
class SaleRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Sale $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return SaleData::collect($data);
    }

    public function toData($model)
    {
        return SaleData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Sale
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Sale
     */
    public function edit($attributes, Sale $sale)
    {
        return $this->update($attributes, $sale);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Sale $sale)
    {
        return $this->delete($sale);
    }
}
