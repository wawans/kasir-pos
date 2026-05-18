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
            ->allowedFilters(...$this->model->getFillable())
            ->allowedSorts(...$this->model->getFillable())
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
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Customer
     */
    public function edit($attributes, Customer $customer)
    {
        return $this->update($attributes, $customer);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Customer $customer)
    {
        return $this->delete($customer);
    }
}
