<?php

namespace App\Observers;

use App\Models\Product;
use App\Models\StockLog;
use App\Repositories\StockRepository;

class StockLogObserver
{
    public function __construct(public StockRepository $stock) {}

    /**
     * Handle the StockLog "created" event.
     */
    public function created(StockLog $stockLog): void
    {
        $stock = $this->stock->firstOrCreateProduct($stockLog->product, $stockLog->quantity);

        $stock->updateSumLogsQuantity();
    }

    /**
     * Handle the StockLog "updated" event.
     */
    public function updated(StockLog $stockLog): void
    {
        $stock = $this->stock->firstOrCreateProduct($stockLog->product, $stockLog->quantity);

        $stock->updateSumLogsQuantity();
    }

    /**
     * Handle the StockLog "deleted" event.
     */
    public function deleted(StockLog $stockLog): void
    {
        $product = Product::find($stockLog->product_id);

        if ($product) {
            $stock = $this->stock->firstOrCreateProduct($stockLog->product, $stockLog->quantity);

            $stock->updateSumLogsQuantity();
        }
    }

    /**
     * Handle the StockLog "restored" event.
     */
    public function restored(StockLog $stockLog): void
    {
        $stock = $this->stock->firstOrCreateProduct($stockLog->product, $stockLog->quantity);

        $stock->updateSumLogsQuantity();
    }

    /**
     * Handle the StockLog "force deleted" event.
     */
    public function forceDeleted(StockLog $stockLog): void
    {
        $product = Product::find($stockLog->product_id);

        if ($product) {
            $stock = $this->stock->firstOrCreateProduct($stockLog->product, $stockLog->quantity);

            $stock->updateSumLogsQuantity();
        }
    }
}
