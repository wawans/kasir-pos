<?php

namespace App\Repositories;

use App\Data\SaleItemData;
use App\Models\SaleItem;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\SaleItemRepository
 *
 * @property SaleItem $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\SaleItem> query()
 * @method \App\Models\SaleItem create(array $attributes)
 * @method \App\Models\SaleItem update(array $attributes, \App\Models\SaleItem $saleItem)
 */
class SaleItemRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected SaleItem $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return SaleItemData::collect($data);
    }

    public function toData($model)
    {
        return SaleItemData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return SaleItem
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return SaleItem
     */
    public function edit($attributes, SaleItem $saleItem)
    {
        return $this->update($attributes, $saleItem);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(SaleItem $saleItem)
    {
        return $this->delete($saleItem);
    }
}
