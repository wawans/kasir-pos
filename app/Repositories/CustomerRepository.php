<?php

namespace App\Repositories;

use App\Data\CustomerData;
use App\Models\Customer;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\CustomerRepository
 *
 * @property Customer $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Customer query()
 * @method \App\Models\Customer update(array $attributes, \App\Models\Customer $customer)
 */
class CustomerRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Customer $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return CustomerData::collect($data);
    }

    public function toData($model)
    {
        return CustomerData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Customer
     */
    public function store($attributes)
    {
        $model = $this->create($attributes);

        if ($model->is_default) {
            $other = $this->model->where('is_default', 1)->whereNot('id', $model->id)->first();
            if ($other) {
                $other->update(['is_default' => 0]);
                $other->saveQuietly();
            }
        }

        return $model;
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Customer
     */
    public function edit($attributes, Customer $customer)
    {
        $is_default_before = $customer->is_default;
        $model = $this->update($attributes, $customer);

        if ($model->is_default && ! $is_default_before) {
            $other = $this->model->where('is_default', 1)->whereNot('id', $model->id)->first();
            if ($other) {
                $other->update(['is_default' => 0]);
                $other->saveQuietly();
            }
        }

        return $model;
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Customer $customer)
    {
        // @TODO: ensure customer dont have sale(s).

        return $this->delete($customer);
    }
}
