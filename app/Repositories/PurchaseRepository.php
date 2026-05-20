<?php

namespace App\Repositories;

use App\Data\PurchaseData;
use App\Models\Purchase;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PurchaseRepository
 *
 * @property Purchase $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Purchase query()
 * @method \App\Models\Purchase create(array $attributes)
 * @method \App\Models\Purchase update(array $attributes, \App\Models\Purchase $purchase)
 */
class PurchaseRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Purchase $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PurchaseData::collect($data);
    }

    public function toData($model)
    {
        return PurchaseData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Purchase
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Purchase
     */
    public function edit($attributes, Purchase $purchase)
    {
        return $this->update($attributes, $purchase);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Purchase $purchase)
    {
        return $this->delete($purchase);
    }
}
