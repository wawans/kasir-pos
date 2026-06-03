<?php

namespace App\Repositories;

use App\Data\PurchaseData;
use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use App\Http\Requests\Purchase\StorePurchaseRequest;
use App\Http\Requests\Purchase\UpdatePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Repositories\Concerns\WithTable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PurchaseRepository
 *
 * @property Purchase $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\Purchase> query()
 * @method \App\Models\Purchase create(array $attributes)
 * @method \App\Models\Purchase update(array $attributes, \App\Models\Purchase $purchase)
 */
class PurchaseRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Purchase $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PurchaseData::collect($data);
    }

    public function toData($model)
    {
        return PurchaseData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  StorePurchaseRequest  $attributes
     * @return Purchase
     * @throws \Throwable
     */
    public function store($attributes)
    {
        $attributes = collect($attributes);
        $attributes->put('price', 0);
        $attributes->put('total', 0);
        $items = collect($attributes->get('items', []));

        DB::beginTransaction();
        try {
            $model = $this->create($attributes->only($this->model->getFillable())->toArray());
            $items = $items->map(function ($item) use ($model) {
                $product = Product::findOrFail($item['product_id']);
                $total = ($product->product_price * $item['quantity']) - $item['discount'];

                return [
                    'purchase_id' => $model->id,
                    'product_id' => $product->id,
                    'unit_id' => $product->unit_id,
                    'price' => $product->product_price,
                    'quantity' => $item['quantity'],
                    'discount' => $item['discount'],
                    'subtotal' => max($total, 0),
                ];
            });

            $model->items()->createMany($items->toArray());
            $subtotal = $model->items()->sum('subtotal');
            $total = $subtotal + $model->tax - $model->discount + $model->shipping;
            $model->update([
                'price' => $subtotal,
                'total' => $total,
            ]);

            $pay = PaymentStatusType::tryFrom($attributes->get('payment_status'));

            if ($pay === PaymentStatusType::PAID) {
                if ($attributes->get('payment_amount') != $total) {
                    throw ValidationException::withMessages(['payment_amount' => 'Payment Amount don\'t match.']);
                }
                // DO PAYMENT ACTION
                $model->payments()->create([
                    'payment_method_id' => $attributes->get('payment_method_id'),
                    'reference' => 'PAY-'.$model->reference,
                    'date' => Carbon::parse($attributes->get('payment_date', now())),
                    'amount' => $total,
                ]);
            }

            $status = StatusType::tryFrom($attributes->get('status'));

            if ($status === StatusType::FINAL) {
                // DO LOG STOCK ACTION
                $model->items->each(function ($item) {
                    $item->loadMissing('stock');
                    $item->stockLog()->create([
                        'product_id' => $item->product_id,
                        'unit_id' => $item->unit_id,
                        'quantity' => $item->quantity,
                        'remaining_quantity' => $item->stock ? ($item->stock->quantity + $item->quantity) : $item->quantity,
                    ]);
                });
            }

            DB::commit();

            return $model;
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error($exception->getMessage());
            return throw app()->isProduction() ? ValidationException::withMessages(['error' => 'Server Error']) : $exception;
        }
    }

    /**
     * Update the model in the database.
     *
     * @param  UpdatePurchaseRequest  $attributes
     * @return Purchase
     */
    public function edit($attributes, Purchase $purchase)
    {
        return $this->update($attributes, $purchase);
    }

    /**
     * Delete the model from the database.
     *
     * @return bool|null|void
     */
    public function destroy(Purchase $purchase)
    {
        return $this->delete($purchase);
    }
}
