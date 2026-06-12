<?php

namespace App\Repositories;

use App\Data\PurchaseReturnData;
use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchaseReturn;
use App\Repositories\Concerns\WithTable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\PurchaseReturnRepository
 *
 * @property PurchaseReturn $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\PurchaseReturn> query()
 * @method \App\Models\PurchaseReturn create(array $attributes)
 * @method \App\Models\PurchaseReturn update(array $attributes, \App\Models\PurchaseReturn $purchaseReturn)
 */
class PurchaseReturnRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected PurchaseReturn $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedIncludes('items', 'items.product', 'items.unit', 'supplier', 'paymentMethod', 'payments', 'purchase',
                'purchase.items', 'purchase.items.product', 'purchase.items.unit', 'purchase.supplier', 'purchase.paymentMethod', 'purchase.payments')
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return PurchaseReturnData::collect($data);
    }

    public function toData($model)
    {
        return PurchaseReturnData::from($model);
    }

    protected function validate(Purchase $purchase, Collection $items)
    {
        $oldItems = $purchase->items->pluck('product_id')->toArray();
        $newItems = $items->pluck('product_id')->toArray();
        $remItems = collect($oldItems)->filter(fn ($f) => ! in_array($f, $newItems))->toArray();

        if (count($remItems) > 0) {
            throw ValidationException::withMessages(['items' => 'Some product items don\'t exist.']);
        }

        return $items->map(function ($item) use ($purchase) {
            /** @var PurchaseItem $child */
            $child = $purchase->items->firstWhere('product_id', $item['product_id'])->loadMissing('product');

            if ($item['quantity'] > $child->quantity) {
                throw ValidationException::withMessages(['items' => 'Return quantity must not be greater than the quantity.']);
            }

            /** @var Product $product */
            $product = $child->product;
            $total = ($product->product_price * $item['quantity']) - $item['discount'];

            if (
                ($product->product_price != $child->price)
                || ($product->unit_id != $child->unit_id)
            ) {
                throw ValidationException::withMessages(['items' => 'Product was updated with different price or unit.']);
            }

            return [
                'product_id' => $product->id,
                'unit_id' => $product->unit_id,
                'price' => $product->product_price,
                'quantity' => $item['quantity'],
                'discount' => $item['discount'],
                'subtotal' => max($total, 0),
            ];
        });
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return PurchaseReturn
     *
     * @throws \Throwable
     */
    public function store($attributes, Purchase $purchase)
    {
        if ($purchase->returned) {
            throw ValidationException::withMessages(['error' => 'This Purchase is already returned.']);
        }

        $attributes = collect($attributes);
        $attributes->put('price', 0);
        $attributes->put('total', 0);
        $items = collect($attributes->get('items', []));

        $pay = PaymentStatusType::tryFrom($attributes->get('payment_status'));
        $status = StatusType::tryFrom($attributes->get('status'));

        // validated items
        $items = $this->validate($purchase, $items);

        DB::beginTransaction();
        try {
            $model = $purchase->returned()->create($attributes->only($this->model->getFillable())->toArray());
            $model->items()->createMany($items->toArray());
            $subtotal = $model->items()->sum('subtotal');
            $total = $subtotal + $model->tax - $model->discount + $model->shipping;
            $model->update([
                'price' => $subtotal,
                'total' => $total,
            ]);

            $payment_method_id = (PaymentMethod::findOrFail($attributes->get('payment_method_id')))->id;
            $payment_date = Carbon::parse($attributes->get('payment_date', now()));
            $payment_reference = 'PAY-'.$model->reference;
            $payment_amount = $total;

            if ($pay === PaymentStatusType::PAID) {
                if ($attributes->get('payment_amount') != $total) {
                    throw ValidationException::withMessages(['payment_amount' => 'Payment Amount don\'t match.']);
                }
                // DO PAYMENT ACTION
                $this->createPayments($model, $payment_method_id, $payment_date, $payment_amount, $payment_reference);
            }

            if ($status === StatusType::FINAL) {
                // DO LOG STOCK ACTION
                $this->createItemsStockLog($model);
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
     * @param  array  $attributes
     * @return PurchaseReturn
     *
     * @throws \Throwable
     */
    public function edit($attributes, PurchaseReturn $purchaseReturn)
    {
        $parent = $purchaseReturn->purchase;

        $attributes = collect($attributes);
        $attributes->put('price', 0);
        $attributes->put('total', 0);
        $items = collect($attributes->get('items', []));

        $pay = PaymentStatusType::tryFrom($attributes->get('payment_status'));
        $status = StatusType::tryFrom($attributes->get('status'));

        // validated items
        $items = $this->validate($parent, $items);

        DB::beginTransaction();
        try {
            $model = $this->update($attributes->only($this->model->getFillable())->toArray(), $purchaseReturn);

            $oldItems = $purchaseReturn->items->pluck('product_id')->toArray();
            $newItems = $items->pluck('product_id')->toArray();
            $remItems = collect($oldItems)->filter(fn ($f) => ! in_array($f, $newItems))->toArray();

            // $model->items()?->delete();
            $purchaseReturn->items->filter(fn ($item) => ! in_array($item->product_id, $newItems))->each(fn ($item) => $item->delete());

            // $model->items()->createMany($items->toArray());
            $items->each(function ($item) use ($purchaseReturn) {
                $e = $purchaseReturn->items->firstWhere('product_id', $item['product_id']);

                ($e) ? $e->update($item) : $purchaseReturn->items()->create($item);
            });

            $subtotal = $model->items()->sum('subtotal');
            $total = $subtotal + $model->tax - $model->discount + $model->shipping;
            $model->update([
                'price' => $subtotal,
                'total' => $total,
            ]);

            $payment_method_id = (PaymentMethod::findOrFail($attributes->get('payment_method_id')))->id;
            $payment_date = Carbon::parse($attributes->get('payment_date', now()));
            $payment_reference = 'PAY-'.$model->reference;
            $payment_amount = $total;

            if ($purchaseReturn->payment_status === PaymentStatusType::PAID) {
                if ($pay === PaymentStatusType::PAID) {
                    if ($attributes->get('payment_amount') != $total) {
                        throw ValidationException::withMessages(['payment_amount' => 'Payment Amount don\'t match.']);
                    }
                    // DO PAYMENT ACTION
                    $this->createPayments($model, $payment_method_id, $payment_date, $payment_amount, $payment_reference);
                } else {
                    $model->payments()?->delete();
                }
            } elseif ($pay === PaymentStatusType::PAID) {
                if ($attributes->get('payment_amount') != $total) {
                    throw ValidationException::withMessages(['payment_amount' => 'Payment Amount don\'t match.']);
                }
                // DO PAYMENT ACTION
                $this->createPayments($model, $payment_method_id, $payment_date, $payment_amount, $payment_reference);
            }

            if ($status === StatusType::FINAL) {
                // DO LOG STOCK ACTION
                // $this->createItemsStockLog($model);
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
     * Delete the model from the database.
     *
     * @return bool|null|void
     *
     * @throws \Throwable
     */
    public function destroy(PurchaseReturn $purchaseReturn)
    {
        DB::beginTransaction();
        try {
            // $model->items()?->delete(); // NOT WORKING!!! THIS DOESN'T TRIGGER OBSERVERS!
            // $model->items->each->delete(); // THIS IS WORKING! - OR -
            // $model->items()->cursor()->each(fn (Item $item) => $item->delete());
            $purchaseReturn->payments()->cursor()->each(fn ($model) => $model->delete());
            $purchaseReturn->items()->cursor()->each(fn ($model) => $model->delete());
            $this->delete($purchaseReturn);

            DB::commit();

            return true;
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error($exception->getMessage());

            return throw app()->isProduction() ? ValidationException::withMessages(['error' => 'Server Error']) : $exception;
        }
    }

    protected function createPayments(
        PurchaseReturn $model,
        int $payment_method_id,
        Carbon $payment_date,
        int $payment_amount,
        ?string $payment_reference = null,
    ) {
        return $model->payments()->create([
            'payment_method_id' => $payment_method_id,
            'reference' => $payment_reference,
            'date' => $payment_date,
            'amount' => $payment_amount,
        ]);
    }

    protected function createItemsStockLog(PurchaseReturn $model)
    {
        $model->items->each(function ($item) {
            $item->loadMissing('stock');
            $quantity = $item->quantity * -1;

            $item->stockLog()->create([
                'product_id' => $item->product_id,
                'unit_id' => $item->unit_id,
                'quantity' => $quantity,
                'remaining_quantity' => $item->stock ? ($item->stock->quantity + $quantity) : $quantity,
            ]);
        });
    }
}
