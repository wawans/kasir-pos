<?php

namespace App\Observers;

use App\Models\SaleItem;

class SaleItemObserver
{
    /**
     * Handle the SaleItem "created" event.
     */
    public function created(SaleItem $item): void
    {
        //
    }

    /**
     * Handle the SaleItem "updated" event.
     */
    public function updated(SaleItem $item): void
    {
        $log = $item->stockLog;
        if ($log) {
            $stock = $item->stockLog->stock;

            $item->stockLog->update([
                'quantity' => $item->quantity,
                'remaining_quantity' => $stock->quantity + $log->quantity - $item->quantity,
            ]);
        }
    }

    /**
     * Handle the SaleItem "deleted" event.
     */
    public function deleted(SaleItem $item): void
    {
        $item->stockLog?->delete();
    }

    /**
     * Handle the SaleItem "restored" event.
     */
    public function restored(SaleItem $item): void
    {
        //
    }

    /**
     * Handle the SaleItem "force deleted" event.
     */
    public function forceDeleted(SaleItem $item): void
    {
        //
    }
}
