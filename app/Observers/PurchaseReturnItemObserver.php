<?php

namespace App\Observers;

use App\Models\PurchaseReturnItem;

class PurchaseReturnItemObserver
{
    /**
     * Handle the PurchaseReturnItem "created" event.
     */
    public function created(PurchaseReturnItem $item): void
    {
        //
    }

    /**
     * Handle the PurchaseReturnItem "updated" event.
     */
    public function updated(PurchaseReturnItem $item): void
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
     * Handle the PurchaseReturnItem "deleting" event.
     */
    public function deleting(PurchaseReturnItem $item): void
    {
        $item->stockLog?->delete();
    }

    /**
     * Handle the PurchaseReturnItem "deleted" event.
     */
    public function deleted(PurchaseReturnItem $item): void
    {
        $item->stockLog?->delete();
    }

    /**
     * Handle the PurchaseReturnItem "restored" event.
     */
    public function restored(PurchaseReturnItem $item): void
    {
        //
    }

    /**
     * Handle the PurchaseReturnItem "force deleted" event.
     */
    public function forceDeleted(PurchaseReturnItem $item): void
    {
        //
    }
}
