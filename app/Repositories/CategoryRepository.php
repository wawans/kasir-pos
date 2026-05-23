<?php

namespace App\Repositories;

use App\Data\CategoryData;
use App\Models\Category;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\CategoryRepository
 *
 * @property Category $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Category query()
 * @method \App\Models\Category create(array $attributes)
 * @method \App\Models\Category update(array $attributes, \App\Models\Category $category)
 */
class CategoryRepository extends Repository
{
    use Concerns\EnsureHasDefault;
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Category $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return CategoryData::collect($data);
    }

    public function toData($model)
    {
        return CategoryData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Category
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
     * @return Category
     */
    public function edit($attributes, Category $category)
    {
        $is_default = $category->is_default;
        $model = $this->update($attributes, $category);
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
    public function destroy(Category $category)
    {
        $is_default = $category->is_default;
        $this->delete($category);
        if ($is_default) {
            $this->ensureHasDefault();
        }

        return true;
    }
}
