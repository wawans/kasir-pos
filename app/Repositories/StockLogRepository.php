<?php

namespace App\Repositories;

use App\Data\StockLogData;
use App\Models\StockLog;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\StockLogRepository
 *
 * @property StockLog $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\StockLog> query()
 * @method \App\Models\StockLog create(array $attributes)
 * @method \App\Models\StockLog update(array $attributes, \App\Models\StockLog $stockLog)
 */
class StockLogRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected StockLog $model) {}

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
        return StockLogData::collect($data);
    }

    public function toData($model)
    {
        return StockLogData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return StockLog
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return StockLog
     */
    public function edit($attributes, StockLog $stockLog)
    {
        return $this->update($attributes, $stockLog);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(StockLog $stockLog)
    {
        return $this->delete($stockLog);
    }
}
