<?php

namespace App\Repositories;

use App\Data\AdjustmentData;
use App\Http\Requests\Adjustment\StoreAdjustmentRequest;
use App\Http\Requests\Adjustment\UpdateAdjustmentRequest;
use App\Models\Adjustment;
use App\Models\Product;
use App\Repositories\Concerns\WithTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * \App\Repositories\AdjustmentRepository
 *
 * @property Adjustment $model
 *
 * @method \Illuminate\Database\Eloquent\Builder<\App\Models\Adjustment> query()
 * @method \App\Models\Adjustment create(array $attributes)
 * @method \App\Models\Adjustment update(array $attributes, \App\Models\Adjustment $adjustment)
 */
class AdjustmentRepository extends Repository
{
    use WithTable;

    /**
     * Create a new repository instance.
     */
    public function __construct(protected Adjustment $model) {}

    public function tableQuery()
    {
        return QueryBuilder::for($this->query())
            ->allowedFilters($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedSorts($this->model->getKeyName(), ...$this->model->getFillable())
            ->allowedIncludes('items', 'items.product', 'items.unit', 'items.product.stock.unit', 'category')
            ->defaultSort('-updated_at');
    }

    public function toCollection($data)
    {
        return AdjustmentData::collect($data);
    }

    public function toData($model)
    {
        return AdjustmentData::from($model);
    }

    /**
     * Create a new instance of the given model.
     *
     * @param  StoreAdjustmentRequest|array  $attributes
     * @return Adjustment
     */
    public function store($attributes)
    {
        $attributes = collect($attributes);
        $attributes->put('adjustment_total_quantity', 0);
        $items = collect($attributes->get('items', []));

        DB::beginTransaction();
        try {
            $model = $this->create($attributes->only($this->model->getFillable())->toArray());
            $items = $items->map(function ($item) use ($model) {
                $product = Product::findOrFail($item['product_id']);

                return [
                    'adjustment_id' => $model->id,
                    'product_id' => $product->id,
                    'unit_id' => $product->unit_id,
                    'adjustment_item_type' => $item['adjustment_item_type'],
                    'quantity' => $item['quantity'],
                ];
            });

            $model->items()->createMany($items->toArray());
            $model->update([
                'adjustment_total_quantity' => $model->items()->count(),
            ]);

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
     * @param  UpdateAdjustmentRequest|array  $attributes
     * @return Adjustment
     */
    public function edit($attributes, Adjustment $adjustment)
    {
        $attributes = collect($attributes);
        $attributes->put('adjustment_total_quantity', 0);
        $items = collect($attributes->get('items', []));

        DB::beginTransaction();
        try {
            $model = $this->update($attributes->only($this->model->getFillable())->toArray(), $adjustment);
            $items = $items->map(function ($item) use ($model) {
                $product = Product::findOrFail($item['product_id']);

                return [
                    'adjustment_id' => $model->id,
                    'product_id' => $product->id,
                    'unit_id' => $product->unit_id,
                    'adjustment_item_type' => $item['adjustment_item_type'],
                    'quantity' => $item['quantity'],
                ];
            });

            $model->items()?->delete();
            $model->items()->createMany($items->toArray());
            $model->update([
                'adjustment_total_quantity' => $model->items()->count(),
            ]);

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
     */
    public function destroy(Adjustment $adjustment)
    {
        return $this->delete($adjustment);
    }
}
