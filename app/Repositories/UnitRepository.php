<?php

namespace App\Repositories;

use App\Data\UnitData;
use App\Models\Unit;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\UnitRepository
 *
 * @property Unit $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Unit query()
 * @method \App\Models\Unit create(array $attributes)
 * @method \App\Models\Unit update(array $attributes, \App\Models\Unit $unit)
 */
class UnitRepository extends Repository
{
    use Concerns\EnsureHasDefault;
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Unit $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return UnitData::collect($data);
    }

    public function toData($model)
    {
        return UnitData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Unit
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
     * @return Unit
     */
    public function edit($attributes, Unit $unit)
    {
        $is_default = $unit->is_default;
        $model = $this->update($attributes, $unit);
        if ($model->is_default && ! $is_default) {
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
    public function destroy(Unit $unit)
    {
        $is_default = $unit->is_default;
        $this->delete($unit);
        if ($is_default) {
            $this->ensureHasDefault();
        }

        return true;
    }
}
