<?php

namespace App\Repositories;

use App\Data\ExpenseData;
use App\Models\Expense;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\ExpenseRepository
 *
 * @property Expense $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Expense query()
 * @method \App\Models\Expense create(array $attributes)
 * @method \App\Models\Expense update(array $attributes, \App\Models\Expense $expense)
 */
class ExpenseRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Expense $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return ExpenseData::collect($data);
    }

    public function toData($model)
    {
        return ExpenseData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Expense
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Expense
     */
    public function edit($attributes, Expense $expense)
    {
        return $this->update($attributes, $expense);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Expense $expense)
    {
        return $this->delete($expense);
    }
}
