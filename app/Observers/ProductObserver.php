<?php

namespace App\Observers;

use App\Models\Product;
use App\Models\StockLog;

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

    public function syncStockAlertLimit(Product $product, StockLog $log): void
    {
        $log->stock?->update([
            'stock_alert_quantity' => $product->stock_alert_quantity,
            'stock_limit_quantity' => $product->stock_limit_quantity,
        ]);
    }

    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        $log = $this->firstOrCreateLog($product);
        $this->syncStockAlertLimit($product, $log);
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        $log = $this->firstOrCreateLog($product);
        $log->update([
            'unit_id' => $product->unit_id,
            'quantity' => $product->stock_opening_quantity,
            'remaining_quantity' => $product->stock_opening_quantity,
        ]);

        $this->syncStockAlertLimit($product, $log);
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        $product->stockLog?->delete();
    }

    /**
     * Handle the Product "restored" event.
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
     * Handle the Product "forceDeleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        $product->stockLog?->delete();
    }
}
