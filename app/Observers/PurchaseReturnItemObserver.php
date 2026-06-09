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
        //
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
