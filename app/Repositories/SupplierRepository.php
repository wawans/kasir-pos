<?php

namespace App\Repositories;

use App\Data\SupplierData;
use App\Models\Supplier;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\SupplierRepository
 *
 * @property Supplier $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Supplier query()
 * @method \App\Models\Supplier update(array $attributes, \App\Models\Supplier $supplier)
 */
class SupplierRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Supplier $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters(...$this->model->getFillable())
            ->allowedSorts(...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return SupplierData::collect($data);
    }

    public function toData($model)
    {
        return SupplierData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Supplier
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Supplier
     */
    public function edit($attributes, Supplier $supplier)
    {
        return $this->update($attributes, $supplier);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Supplier $supplier)
    {
        return $this->delete($supplier);
    }
}
