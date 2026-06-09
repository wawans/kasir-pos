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

            $item->stockLog->update([
                'quantity' => $item->quantity,
                'remaining_quantity' => $stock->quantity - $log->quantity + $item->quantity,
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
