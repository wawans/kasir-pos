<?php

namespace App\Repositories;

use App\Data\SaleData;
use App\Enums\PaymentStatusType;
use App\Enums\StatusType;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Repositories\Concerns\WithTable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\SaleRepository
 *
 * @property Sale $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\Sale> query()
 * @method \App\Models\Sale create(array $attributes)
 * @method \App\Models\Sale update(array $attributes, \App\Models\Sale $sale)
 */
class SaleRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Sale $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedIncludes(
                ...$this->model::getAllowedIncludes(),
                ...array_map(fn ($s) => 'items.'.$s, SaleItem::getAllowedIncludes()),
            )
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return SaleData::collect($data);
    }

    public function toData($model)
    {
        return SaleData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  array  $attributes
     * @return Sale
     *
     * @throws \Throwable
     */
    public function store($attributes)
    {
        $attributes = collect($attributes);
        $attributes->put('price', 0);
        $attributes->put('total', 0);
        $items = collect($attributes->get('items', []));

        $pay = PaymentStatusType::tryFrom($attributes->get('payment_status'));
        $status = StatusType::tryFrom($attributes->get('status'));

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
     * @return Sale
     *
     * @throws \Throwable
     */
    public function edit($attributes, Sale $sale)
    {
        if ($sale->returned) {
            throw ValidationException::withMessages(['error' => 'This Sale is already returned.']);
        }

        $attributes = collect($attributes);
        $attributes->put('price', 0);
        $attributes->put('total', 0);
        $items = collect($attributes->get('items', []));

        $pay = PaymentStatusType::tryFrom($attributes->get('payment_status'));
        $status = StatusType::tryFrom($attributes->get('status'));

        DB::beginTransaction();
        try {
            $model = $this->update($attributes->only($this->model->getFillable())->toArray(), $sale);
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

            $oldItems = $sale->items->pluck('product_id')->toArray();
            $newItems = $items->pluck('product_id')->toArray();
            $remItems = collect($oldItems)->filter(fn ($f) => ! in_array($f, $newItems))->toArray();

            // $model->items()?->delete();
            $sale->items->filter(fn ($item) => ! in_array($item->product_id, $newItems))->each(fn ($item) => $item->delete());

            // $model->items()->createMany($items->toArray());
            $items->each(function ($item) use ($sale) {
                $e = $sale->items->firstWhere('product_id', $item['product_id']);

                ($e) ? $e->update($item) : $sale->items()->create($item);
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

            if ($sale->payment_status === PaymentStatusType::PAID) {
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
    public function destroy(Sale $sale)
    {
        DB::beginTransaction();
        try {
            // $model->items()?->delete(); // NOT WORKING!!! THIS DOESN'T TRIGGER OBSERVERS!
            // $model->items->each->delete(); // THIS IS WORKING! - OR -
            // $model->items()->cursor()->each(fn (Item $item) => $item->delete());
            $sale->payments()->cursor()->each(fn ($model) => $model->delete());
            $sale->items()->cursor()->each(fn ($model) => $model->delete());
            $this->delete($sale);

            DB::commit();

            return true;
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error($exception->getMessage());

            return throw app()->isProduction() ? ValidationException::withMessages(['error' => 'Server Error']) : $exception;
        }
    }

    protected function createPayments(
        Sale $model,
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

    protected function createItemsStockLog(Sale $model)
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
