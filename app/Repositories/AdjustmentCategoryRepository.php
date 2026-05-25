<?php

namespace App\Repositories;

use App\Data\AdjustmentCategoryData;
use App\Models\AdjustmentCategory;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\AdjustmentCategoryRepository
 *
 * @property AdjustmentCategory $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\AdjustmentCategory query()
 * @method \App\Models\AdjustmentCategory create(array $attributes)
 * @method \App\Models\AdjustmentCategory update(array $attributes, \App\Models\AdjustmentCategory $adjustmentCategory)
 */
class AdjustmentCategoryRepository extends Repository
{
    use Concerns\EnsureHasDefault;
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected AdjustmentCategory $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return AdjustmentCategoryData::collect($data);
    }

    public function toData($model)
    {
        return AdjustmentCategoryData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return AdjustmentCategory
     */
    public function store($attributes)
    {
        $model = $this->create($attributes);
        if ($model->is_default) {
            $this->ensureOneDefault($model);
        }
        if (! $model->is_default) {
            $this->ensureHasDefault();
        }

        return $model;
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return AdjustmentCategory
     */
    public function edit($attributes, AdjustmentCategory $adjustmentCategory)
    {
        $is_default_before = $adjustmentCategory->is_default;
        $model = $this->update($attributes, $adjustmentCategory);
        if ($model->is_default && ! $is_default_before) {
            $this->ensureOneDefault($model);
        }
        if (! $model->is_default) {
            $this->ensureHasDefault();
        }

        return $model;
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(AdjustmentCategory $adjustmentCategory)
    {
        $is_default = $adjustmentCategory->is_default;
        $this->delete($adjustmentCategory);
        if ($is_default) {
            $this->ensureHasDefault();
        }

        return true;
    }
}
