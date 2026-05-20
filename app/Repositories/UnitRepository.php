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
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Unit $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
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
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Unit
     */
    public function edit($attributes, Unit $unit)
    {
        return $this->update($attributes, $unit);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Unit $unit)
    {
        return $this->delete($unit);
    }
}
