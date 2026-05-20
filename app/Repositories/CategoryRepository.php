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
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Category
     */
    public function edit($attributes, Category $category)
    {
        return $this->update($attributes, $category);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Category $category)
    {
        return $this->delete($category);
    }
}
