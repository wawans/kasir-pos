<?php

namespace App\Repositories;

use App\Data\HoldItemData;
use App\Models\HoldItem;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\HoldItemRepository
 *
 * @property HoldItem $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\HoldItem query()
 * @method \App\Models\HoldItem create(array $attributes)
 * @method \App\Models\HoldItem update(array $attributes, \App\Models\HoldItem $holdItem)
 */
class HoldItemRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected HoldItem $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return HoldItemData::collect($data);
    }

    public function toData($model)
    {
        return HoldItemData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return HoldItem
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return HoldItem
     */
    public function edit($attributes, HoldItem $holdItem)
    {
        return $this->update($attributes, $holdItem);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(HoldItem $holdItem)
    {
        return $this->delete($holdItem);
    }
}
