<?php

namespace App\Repositories;

use App\Data\SaleReturnItemData;
use App\Models\SaleReturnItem;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\SaleReturnItemRepository
 *
 * @property SaleReturnItem $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\SaleReturnItem query()
 * @method \App\Models\SaleReturnItem create(array $attributes)
 * @method \App\Models\SaleReturnItem update(array $attributes, \App\Models\SaleReturnItem $saleReturnItem)
 */
class SaleReturnItemRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected SaleReturnItem $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return SaleReturnItemData::collect($data);
    }

    public function toData($model)
    {
        return SaleReturnItemData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return SaleReturnItem
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return SaleReturnItem
     */
    public function edit($attributes, SaleReturnItem $saleReturnItem)
    {
        return $this->update($attributes, $saleReturnItem);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(SaleReturnItem $saleReturnItem)
    {
        return $this->delete($saleReturnItem);
    }
}
