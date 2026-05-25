<?php

namespace App\Repositories;

use App\Data\AdjustmentData;
use App\Models\Adjustment;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\AdjustmentRepository
 *
 * @property Adjustment $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Adjustment query()
 * @method \App\Models\Adjustment create(array $attributes)
 * @method \App\Models\Adjustment update(array $attributes, \App\Models\Adjustment $adjustment)
 */
class AdjustmentRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Adjustment $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return AdjustmentData::collect($data);
    }

    public function toData($model)
    {
        return AdjustmentData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Adjustment
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Adjustment
     */
    public function edit($attributes, Adjustment $adjustment)
    {
        return $this->update($attributes, $adjustment);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Adjustment $adjustment)
    {
        return $this->delete($adjustment);
    }
}
