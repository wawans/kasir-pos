<?php

namespace App\Repositories;

use App\Data\ExpenseCategoryData;
use App\Models\ExpenseCategory;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\ExpenseCategoryRepository
 *
 * @property ExpenseCategory $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\ExpenseCategory> query()
 * @method \App\Models\ExpenseCategory create(array $attributes)
 * @method \App\Models\ExpenseCategory update(array $attributes, \App\Models\ExpenseCategory $expenseCategory)
 */
class ExpenseCategoryRepository extends Repository
{
    use Concerns\EnsureHasDefault;
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected ExpenseCategory $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return ExpenseCategoryData::collect($data);
    }

    public function toData($model)
    {
        return ExpenseCategoryData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return ExpenseCategory
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
     * @return ExpenseCategory
     */
    public function edit($attributes, ExpenseCategory $expenseCategory)
    {
        $is_default_before = $expenseCategory->is_default;
        $model = $this->update($attributes, $expenseCategory);
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
    public function destroy(ExpenseCategory $expenseCategory)
    {
        $is_default = $expenseCategory->is_default;
        $this->delete($expenseCategory);
        if ($is_default) {
            $this->ensureHasDefault();
        }

        return true;
    }
}
