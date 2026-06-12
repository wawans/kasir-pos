<?php

namespace App\Repositories;

use App\Data\StockData;
use App\Models\Product;
use App\Models\Stock;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\StockRepository
 *
 * @property Stock $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\Stock> query()
 * @method \App\Models\Stock create(array $attributes)
 * @method \App\Models\Stock update(array $attributes, \App\Models\Stock $stock)
 */
class StockRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Stock $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedIncludes('product', 'unit')
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return StockData::collect($data);
    }

    public function toData($model)
    {
        return StockData::from($model);
    }

    public function firstOrCreateProduct(Product $product, $quantity = 0)
    {
        return $this->model->firstOrCreate(['product_id' => $product->id], [
            'quantity' => $quantity,
            'unit_id' => $product->unit_id,
            'stock_alert_quantity' => $product->stock_alert_quantity,
            'stock_limit_quantity' => $product->stock_limit_quantity,
        ]);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Stock
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Stock
     */
    public function edit($attributes, Stock $stock)
    {
        return $this->update($attributes, $stock);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Stock $stock)
    {
        return $this->delete($stock);
    }
}
