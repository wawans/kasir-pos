<?php

namespace App\Repositories;

use App\Data\BrandData;
use App\Models\Brand;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\BrandRepository
 *
 * @property Brand $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Brand query()
 * @method \App\Models\Brand create(array $attributes)
 * @method \App\Models\Brand update(array $attributes, \App\Models\Brand $brand)
 */
class BrandRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Brand $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return BrandData::collect($data);
    }

    public function toData($model)
    {
        return BrandData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Brand
     */
    public function store($attributes)
    {
        $model = $this->create($attributes);

        if ($model->is_default) {
            $other = $this->model->where('is_default', 1)->whereNot('id', $model->id)->first();
            if ($other) {
                $other->update(['is_default' => 0]);
                $other->saveQuietly();
            }
        }

        return $model;
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Brand
     */
    public function edit($attributes, Brand $brand)
    {
        $is_default_before = $brand->is_default;
        $model = $this->update($attributes, $brand);

        if ($model->is_default && ! $is_default_before) {
            $other = $this->model->where('is_default', 1)->whereNot('id', $model->id)->first();
            if ($other) {
                $other->update(['is_default' => 0]);
                $other->saveQuietly();
            }
        }

        return $model;
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Brand $brand)
    {
        // @TODO: ensure brand don't have product(s)

        return $this->delete($brand);
    }
}
