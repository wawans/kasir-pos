<?php

namespace App\Repositories;

use App\Data\PaymentMethodData;
use App\Models\PaymentMethod;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PaymentMethodRepository
 *
 * @property PaymentMethod $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\PaymentMethod query()
 * @method \App\Models\PaymentMethod create(array $attributes)
 * @method \App\Models\PaymentMethod update(array $attributes, \App\Models\PaymentMethod $paymentMethod)
 */
class PaymentMethodRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected PaymentMethod $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PaymentMethodData::collect($data);
    }

    public function toData($model)
    {
        return PaymentMethodData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return PaymentMethod
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return PaymentMethod
     */
    public function edit($attributes, PaymentMethod $paymentMethod)
    {
        return $this->update($attributes, $paymentMethod);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        return $this->delete($paymentMethod);
    }
}
