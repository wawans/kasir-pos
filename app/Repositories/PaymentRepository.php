<?php

namespace App\Repositories;

use App\Data\PaymentData;
use App\Models\Payment;
use App\Repositories\Concerns\WithTable;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PaymentRepository
 *
 * @property Payment $model
 *
 * @method \Illuminate\Database\Eloquent\Builder|\App\Models\Payment query()
 * @method \App\Models\Payment create(array $attributes)
 * @method \App\Models\Payment update(array $attributes, \App\Models\Payment $payment)
 */
class PaymentRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Payment $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PaymentData::collect($data);
    }

    public function toData($model)
    {
        return PaymentData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Payment
     */
    public function store($attributes)
    {
        return $this->create($attributes);
    }

    /**
     * Update the model in the database.
     *
     * @param  array  $attributes
     * @return Payment
     */
    public function edit($attributes, Payment $payment)
    {
        return $this->update($attributes, $payment);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Payment $payment)
    {
        return $this->delete($payment);
    }
}
