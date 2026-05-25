<?php

namespace App\Repositories;

use App\Data\PurchaseItemData;
use App\Models\PurchaseItem;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PurchaseItemRepository
 *
 * @property PurchaseItem $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\PurchaseItem query()
 * @method \App\Models\PurchaseItem create(array $attributes)
 * @method \App\Models\PurchaseItem update(array $attributes, \App\Models\PurchaseItem $purchaseItem)
 */
class PurchaseItemRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected PurchaseItem $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PurchaseItemData::collect($data);
    }

    public function toData($model)
    {
        return PurchaseItemData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return PurchaseItem
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return PurchaseItem
     */
    public function edit($attributes, PurchaseItem $purchaseItem)
    {
        return $this->update($attributes, $purchaseItem);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(PurchaseItem $purchaseItem)
    {
        return $this->delete($purchaseItem);
    }
}
