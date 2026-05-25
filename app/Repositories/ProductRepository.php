<?php

namespace App\Repositories;

use App\Data\ProductData;
use App\Models\Product;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\ProductRepository
 *
 * @property Product $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Product query()
 * @method \App\Models\Product create(array $attributes)
 * @method \App\Models\Product update(array $attributes, \App\Models\Product $product)
 */
class ProductRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Product $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return ProductData::collect($data);
    }

    public function toData($model)
    {
        return ProductData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Product
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Product
     */
    public function edit($attributes, Product $product)
    {
        return $this->update($attributes, $product);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Product $product)
    {
        return $this->delete($product);
    }
}
