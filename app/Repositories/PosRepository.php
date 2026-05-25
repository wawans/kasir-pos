<?php

namespace App\Repositories;

use App\Data\PosData;
use App\Models\Pos;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PosRepository
 *
 * @property Pos $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Pos query()
 * @method \App\Models\Pos create(array $attributes)
 * @method \App\Models\Pos update(array $attributes, \App\Models\Pos $pos)
 */
class PosRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Pos $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PosData::collect($data);
    }

    public function toData($model)
    {
        return PosData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Pos
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Pos
     */
    public function edit($attributes, Pos $pos)
    {
        return $this->update($attributes, $pos);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Pos $pos)
    {
        return $this->delete($pos);
    }
}
