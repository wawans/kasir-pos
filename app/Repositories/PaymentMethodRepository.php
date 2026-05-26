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
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\PaymentMethod> query()
 * @method \App\Models\PaymentMethod create(array $attributes)
 * @method \App\Models\PaymentMethod update(array $attributes, \App\Models\PaymentMethod $paymentMethod)
 */
class PaymentMethodRepository extends Repository
{
    use Concerns\EnsureHasDefault;
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected PaymentMethod $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
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
     * @return PaymentMethod
     */
    public function edit($attributes, PaymentMethod $paymentMethod)
    {
        $is_default = $paymentMethod->is_default;
        $model = $this->update($attributes, $paymentMethod);
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
    public function destroy(PaymentMethod $paymentMethod)
    {
        $is_default = $paymentMethod->is_default;
        $this->delete($paymentMethod);
        if ($is_default) {
            $this->ensureHasDefault();
        }

        return true;
    }
}
