<?php

namespace App\Observers;

use App\Models\Product;

class ProductObserver
{
    public function firstOrCreateLog(Product $product)
    {
        $log = $product->stockLog;
        if (! $log) {
            $log = $product->stockLog()->create([
                'product_id' => $product->id,
                'unit_id' => $product->unit_id,
                'quantity' => $product->stock_opening_quantity,
                'remaining_quantity' => $product->stock_opening_quantity,
            ]);
        }

        return $log;
    }

    /**
     * Handle the "created" event.
     */
    public function created(Product $product): void
    {
        $this->firstOrCreateLog($product);

    }

    /**
     * Handle the "updated" event.
     */
    public function updated(Product $product): void
    {
        $log = $this->firstOrCreateLog($product);
        $log->update([
            'unit_id' => $product->unit_id,
            'quantity' => $product->stock_opening_quantity,
            'remaining_quantity' => $product->stock_opening_quantity,
        ]);
    }

    /**
     * Handle the "deleted" event.
     */
    public function deleted(Product $product): void
    {
        $product->stockLog?->delete();
    }

    /**
     * Handle the "restored" event.
     */
    public function restored(Product $product): void
    {
        $log = $this->firstOrCreateLog($product);
        $log->update([
            'unit_id' => $product->unit_id,
            'quantity' => $product->stock_opening_quantity,
            'remaining_quantity' => $product->stock_opening_quantity,
        ]);
    }

    /**
     * Handle the "forceDeleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        $product->stockLog?->delete();
    }
}
