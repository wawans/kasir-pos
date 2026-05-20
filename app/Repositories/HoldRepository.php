<?php

namespace App\Repositories;

use App\Data\HoldData;
use App\Models\Hold;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\HoldRepository
 *
 * @property Hold $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Hold query()
 * @method \App\Models\Hold create(array $attributes)
 * @method \App\Models\Hold update(array $attributes, \App\Models\Hold $hold)
 */
class HoldRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Hold $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return HoldData::collect($data);
    }

    public function toData($model)
    {
        return HoldData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Hold
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Hold
     */
    public function edit($attributes, Hold $hold)
    {
        return $this->update($attributes, $hold);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Hold $hold)
    {
        return $this->delete($hold);
    }
}
