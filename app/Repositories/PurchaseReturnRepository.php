<?php

namespace App\Repositories;

use App\Data\PurchaseReturnData;
use App\Models\PurchaseReturn;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PurchaseReturnRepository
 *
 * @property PurchaseReturn $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\PurchaseReturn> query()
 * @method \App\Models\PurchaseReturn create(array $attributes)
 * @method \App\Models\PurchaseReturn update(array $attributes, \App\Models\PurchaseReturn $purchaseReturn)
 */
class PurchaseReturnRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected PurchaseReturn $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PurchaseReturnData::collect($data);
    }

    public function toData($model)
    {
        return PurchaseReturnData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return PurchaseReturn
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return PurchaseReturn
     */
    public function edit($attributes, PurchaseReturn $purchaseReturn)
    {
        return $this->update($attributes, $purchaseReturn);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(PurchaseReturn $purchaseReturn)
    {
        return $this->delete($purchaseReturn);
    }
}
