<?php

namespace App\Observers;

use App\Models\PurchaseItem;

class PurchaseItemObserver
{
    /**
     * Handle the PurchaseItem "updated" event.
     */
    public function updated(PurchaseItem $item): void
    {
        $log = $item->stockLog;
        if ($log) {
            $stock = $item->stockLog->stock;
            $remaining = $stock->quantity;
            $change = $log->quantity;
            $origin = $remaining - $change;

            $quantity = $item->quantity;

            $item->stockLog->update([
                'quantity' => $quantity,
                'remaining_quantity' => $origin + $quantity,
            ]);
        }
    }

    /**
     * Handle the PurchaseItem "deleting" event.
     */
    public function deleting(PurchaseItem $item): void
    {
        $item->stockLog?->delete();
    }

    /**
     * Handle the PurchaseItem "deleted" event.
     */
    public function deleted(PurchaseItem $item): void
    {
        $item->stockLog?->delete();
    }
}
