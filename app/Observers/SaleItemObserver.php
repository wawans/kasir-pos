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
            $remaining = $stock->quantity;
            $change = $log->quantity;
            $origin = $remaining - $change;

            $quantity = $item->quantity * -1;

            $item->stockLog->update([
                'quantity' => $quantity,
                'remaining_quantity' => $origin + $quantity,
            ]);
        }
    }

    /**
     * Handle the SaleItem "deleting" event.
     */
    public function deleting(SaleItem $item): void
    {
        $item->stockLog?->delete();
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
