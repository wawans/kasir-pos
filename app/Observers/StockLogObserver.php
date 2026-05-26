<?php

namespace App\Observers;

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

        $stock->update(['quantity' => $stock->sumLogsQuantity()]);
    }

    /**
     * Handle the StockLog "updated" event.
     */
    public function updated(StockLog $stockLog): void
    {
        //
    }

    /**
     * Handle the StockLog "deleted" event.
     */
    public function deleted(StockLog $stockLog): void
    {
        //
    }

    /**
     * Handle the StockLog "restored" event.
     */
    public function restored(StockLog $stockLog): void
    {
        //
    }

    /**
     * Handle the StockLog "force deleted" event.
     */
    public function forceDeleted(StockLog $stockLog): void
    {
        //
    }
}
