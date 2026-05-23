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
    use Concerns\EnsureHasDefault;
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Supplier $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
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
        $model = $this->create($attributes);

        if ($model->is_default) {
            $this->ensureOneDefault($model);
        }
        if (! $model->is_default) {
            $this->ensureHasDefault();
        }

        return $model;
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Supplier
     */
    public function edit($attributes, Supplier $supplier)
    {
        $is_default = $supplier->is_default;
        $model = $this->update($attributes, $supplier);
        if ($model->is_default && ! $is_default) {
            $this->ensureOneDefault($model);
        }
        if (! $model->is_default) {
            $this->ensureHasDefault();
        }

        return $model;
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Supplier $supplier)
    {
        // @TODO: ensure supplier dont have purchase(s).

        $is_default = $supplier->is_default;
        $this->delete($supplier);
        if ($is_default) {
            $this->ensureHasDefault();
        }

        return true;
    }
}
