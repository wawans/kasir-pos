<?php

namespace App\Repositories;

use App\Data\AdjustmentItemData;
use App\Models\AdjustmentItem;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\AdjustmentItemRepository
 *
 * @property AdjustmentItem $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\AdjustmentItem> query()
 * @method \App\Models\AdjustmentItem create(array $attributes)
 * @method \App\Models\AdjustmentItem update(array $attributes, \App\Models\AdjustmentItem $adjustmentItem)
 */
class AdjustmentItemRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected AdjustmentItem $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return AdjustmentItemData::collect($data);
    }

    public function toData($model)
    {
        return AdjustmentItemData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return AdjustmentItem
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return AdjustmentItem
     */
    public function edit($attributes, AdjustmentItem $adjustmentItem)
    {
        return $this->update($attributes, $adjustmentItem);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(AdjustmentItem $adjustmentItem)
    {
        return $this->delete($adjustmentItem);
    }
}
