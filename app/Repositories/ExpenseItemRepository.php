<?php

namespace App\Repositories;

use App\Data\ExpenseItemData;
use App\Models\ExpenseItem;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\ExpenseItemRepository
 *
 * @property ExpenseItem $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\ExpenseItem query()
 * @method \App\Models\ExpenseItem create(array $attributes)
 * @method \App\Models\ExpenseItem update(array $attributes, \App\Models\ExpenseItem $expenseItem)
 */
class ExpenseItemRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected ExpenseItem $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return ExpenseItemData::collect($data);
    }

    public function toData($model)
    {
        return ExpenseItemData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return ExpenseItem
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return ExpenseItem
     */
    public function edit($attributes, ExpenseItem $expenseItem)
    {
        return $this->update($attributes, $expenseItem);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(ExpenseItem $expenseItem)
    {
        return $this->delete($expenseItem);
    }
}
