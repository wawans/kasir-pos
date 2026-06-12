<?php

namespace App\Repositories;

use App\Data\PurchaseReturnItemData;
use App\Models\PurchaseReturnItem;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PurchaseReturnItemRepository
 *
 * @property PurchaseReturnItem $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\PurchaseReturnItem> query()
 * @method \App\Models\PurchaseReturnItem create(array $attributes)
 * @method \App\Models\PurchaseReturnItem update(array $attributes, \App\Models\PurchaseReturnItem $purchaseReturnItem)
 */
class PurchaseReturnItemRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected PurchaseReturnItem $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PurchaseReturnItemData::collect($data);
    }

    public function toData($model)
    {
        return PurchaseReturnItemData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return PurchaseReturnItem
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return PurchaseReturnItem
     */
    public function edit($attributes, PurchaseReturnItem $purchaseReturnItem)
    {
        return $this->update($attributes, $purchaseReturnItem);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(PurchaseReturnItem $purchaseReturnItem)
    {
        return $this->delete($purchaseReturnItem);
    }
}
